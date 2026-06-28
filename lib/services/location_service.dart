import 'package:geolocator/geolocator.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Streams the caregiver's GPS position to Firestore.
///
/// IMPORTANT: as well as lat/lng, this stamps the caregiver's `linkedChildId`
/// (the email_name link key) onto the location document. That lets the parent
/// — who only knows the link key, not the caregiver's UID — find the location
/// by querying `caregiver_locations where childId == linkKey`.
class LocationService {
  final String caregiverId;
  LocationService(this.caregiverId);

  Future<void> startTracking() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    if (permission == LocationPermission.deniedForever) return;

    // Look up the caregiver's link key once, so we can stamp it on each update.
    String linkKey = '';
    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(caregiverId)
          .get();
      if (doc.exists && doc.data() != null) {
        linkKey = (doc.data()!['linkedChildId'] ?? '').toString();
      }
    } catch (_) {
      // If we can't read it now, updates below will still write lat/lng;
      // childId just won't be set until the caregiver is linked.
    }

    const LocationSettings locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10,
    );

    Geolocator.getPositionStream(locationSettings: locationSettings).listen(
      (Position position) {
        final data = <String, dynamic>{
          'lat': position.latitude,
          'lng': position.longitude,
          'lastUpdated': FieldValue.serverTimestamp(),
          'caregiverId': caregiverId,
        };
        if (linkKey.isNotEmpty) {
          data['childId'] = linkKey;
        }
        FirebaseFirestore.instance
            .collection('caregiver_locations')
            .doc(caregiverId)
            .set(data, SetOptions(merge: true));
      },
    );
  }
}