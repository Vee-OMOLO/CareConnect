import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Free caregiver-location view — no Google Maps, no billing, no extra packages.
///
/// Reads `caregiver_locations` where `childId` == the link key the parent and
/// caregiver share, and shows the latest coordinates, when they were updated,
/// and a tappable Google Maps web link (copyable) the parent can open in any
/// browser or maps app.
class ParentTrackingScreen extends StatelessWidget {
  final String childId; // the link key (email_name)
  const ParentTrackingScreen({super.key, required this.childId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Caregiver Location',
            style: TextStyle(color: Colors.black87)),
        backgroundColor: Colors.white,
        elevation: 0.5,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('caregiver_locations')
            .where('childId', isEqualTo: childId)
            .limit(1)
            .snapshots(),
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snap.hasData || snap.data!.docs.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.location_off_outlined,
                        size: 64, color: Color(0xFF94A3B8)),
                    SizedBox(height: 16),
                    Text('No location yet.',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Text(
                      'The caregiver\'s location will appear here once they '
                      'open their dashboard with location turned on.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.black54),
                    ),
                  ],
                ),
              ),
            );
          }

          final data = snap.data!.docs.first.data() as Map<String, dynamic>;
          final double? lat = (data['lat'] as num?)?.toDouble();
          final double? lng = (data['lng'] as num?)?.toDouble();
          final Timestamp? ts = data['lastUpdated'] as Timestamp?;

          if (lat == null || lng == null) {
            return const Center(child: Text('Waiting for location signal…'));
          }

          final String coordsText =
              '${lat.toStringAsFixed(6)}, ${lng.toStringAsFixed(6)}';
          final String mapsUrl =
              'https://www.google.com/maps/search/?api=1&query=$lat,$lng';
          final String updatedText = ts != null
              ? _timeAgo(ts.toDate())
              : 'just now';

          return Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 46,
                            height: 46,
                            decoration: BoxDecoration(
                              color: const Color(0xFF34A853)
                                  .withValues(alpha: 0.12),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.location_on_rounded,
                                color: Color(0xFF34A853)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Current location',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700)),
                                const SizedBox(height: 2),
                                Text('Updated $updatedText',
                                    style: const TextStyle(
                                        fontSize: 12,
                                        color: Color(0xFF94A3B8))),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Text('Coordinates',
                          style: TextStyle(
                              fontSize: 12, color: Color(0xFF64748B))),
                      const SizedBox(height: 4),
                      SelectableText(
                        coordsText,
                        style: const TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Tappable maps link — copy to clipboard so the parent can
                // paste it into any browser / maps app. No API key needed.
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A73E8).withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Open in maps',
                          style: TextStyle(
                              fontSize: 12, color: Color(0xFF64748B))),
                      const SizedBox(height: 4),
                      SelectableText(
                        mapsUrl,
                        style: const TextStyle(
                            fontSize: 13, color: Color(0xFF1A73E8)),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: mapsUrl));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                    'Map link copied — paste it into your browser'),
                                backgroundColor: Color(0xFF1A73E8),
                              ),
                            );
                          },
                          icon: const Icon(Icons.copy, color: Colors.white),
                          label: const Text('Copy map link',
                              style: TextStyle(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1A73E8),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  String _timeAgo(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inSeconds < 60) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes} min ago';
    if (diff.inHours < 24) return '${diff.inHours} hr ago';
    return '${diff.inDays} day(s) ago';
  }
}