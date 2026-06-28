import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../models/activity_log_model.dart';
import '../models/emergency_contact_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final _uuid = const Uuid();

  Future<void> logActivity({
    required String childId,
    required String caregiverId,
    required String activityType,
    required String details,
    String? mediaUrl,
  }) async {
    final id = _uuid.v4();
    final log = ActivityLog(
      id: id,
      childId: childId,
      caregiverId: caregiverId,
      activityType: activityType,
      details: details,
      timestamp: DateTime.now(),
      mediaUrl: mediaUrl,
    );

    await _db
        .collection('activityLogs')
        .doc(childId)
        .collection('logs')
        .doc(id)
        .set(log.toMap());
  }

  Stream<List<ActivityLog>> getActivityLogsStream(String childId) {
    return _db
        .collection('activityLogs')
        .doc(childId)
        .collection('logs')
        .orderBy('timestamp', descending: true)
        .limit(50)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ActivityLog.fromMap(doc.data()))
            .toList());
  }

  Future<List<EmergencyContact>> getEmergencyContacts(String childId) async {
    final snapshot = await _db
        .collection('children')
        .doc(childId)
        .collection('emergencyContacts')
        .get();

    return snapshot.docs
        .map((doc) => EmergencyContact.fromMap(doc.data()))
        .toList();
  }

  Future<void> addEmergencyContact({
    required String childId,
    required EmergencyContact contact,
  }) async {
    await _db
        .collection('children')
        .doc(childId)
        .collection('emergencyContacts')
        .doc(contact.id)
        .set(contact.toMap());
  }

  Future<void> triggerSOS({
    required String childId,
    required String caregiverId,
    required String location,
    required String description,
  }) async {
    await _db.collection('sosAlerts').add({
      'childId': childId,
      'caregiverId': caregiverId,
      'location': location,
      'description': description,
      'timestamp': DateTime.now().toIso8601String(),
      'status': 'active',
    });
  }
}