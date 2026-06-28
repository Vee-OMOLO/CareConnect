import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/firestore_service.dart';
import '../../services/notification_service.dart';

class LogActivityScreen extends StatefulWidget {
  final String activityType;
  final String childId;
  final String caregiverId;

  const LogActivityScreen({super.key, required this.activityType, required this.childId, required this.caregiverId});

  @override
  State<LogActivityScreen> createState() => _LogActivityScreenState();
}

class _LogActivityScreenState extends State<LogActivityScreen> {
  final _detailsController = TextEditingController();
  final _firestoreService = FirestoreService();
  bool _isSubmitting = false;

  Map<String, List<String>> get _presets => {
    'feeding': ['4oz bottle', '6oz bottle', 'Breastfed 10min', 'Solid food', 'Rejected food'],
    'sleep': ['Nap - 30min', 'Nap - 1hr', 'Nap - 2hr', 'Refused nap', 'Slept well'],
    'diaper': ['Wet', 'Dirty', 'Both', 'Dry check'],
    'play': ['Outdoor play', 'Tummy time', 'Reading', 'Educational toys', 'Music time'],
    'medicine': ['Paracetamol given', 'Vitamin drops', 'Doctor prescribed', 'Declined medicine'],
  };

  Future<void> _submitLog() async {
    if (_detailsController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please add details for this activity')));
      return;
    }
    setState(() => _isSubmitting = true);
    try {
      await _firestoreService.logActivity(childId: widget.childId, caregiverId: widget.caregiverId, activityType: widget.activityType, details: _detailsController.text);
      await NotificationService.sendActivityNotification(childId: widget.childId, activityType: widget.activityType, details: _detailsController.text);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Activity logged! Parent has been notified.'), backgroundColor: Color(0xFF34A853)));
        Navigator.pop(context);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final timeString = DateFormat('h:mm a, MMM d').format(now);

    return Scaffold(
      appBar: AppBar(title: Text('Log ${widget.activityType.toUpperCase()}'), backgroundColor: Colors.white, foregroundColor: Colors.black87, elevation: 0.5),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(color: const Color(0xFFE8F0FE), borderRadius: BorderRadius.circular(10)),
              child: Row(children: [const Icon(Icons.access_time, size: 16, color: Color(0xFF1A73E8)), const SizedBox(width: 8), Text('Logging at: $timeString', style: const TextStyle(color: Color(0xFF1A73E8), fontSize: 13))]),
            ),
            const SizedBox(height: 20),
            const Text('Quick select:', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8, runSpacing: 8,
              children: (_presets[widget.activityType] ?? []).map((preset) {
                return GestureDetector(onTap: () => _detailsController.text = preset, child: Chip(label: Text(preset), backgroundColor: const Color(0xFFE8F0FE), labelStyle: const TextStyle(color: Color(0xFF1A73E8))));
              }).toList(),
            ),
            const SizedBox(height: 20),
            TextField(controller: _detailsController, maxLines: 3, decoration: InputDecoration(labelText: 'Notes / Details', hintText: 'Add any additional notes...', filled: true, fillColor: Colors.white, border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)))),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity, height: 52,
              child: ElevatedButton.icon(
                onPressed: _isSubmitting ? null : _submitLog,
                icon: _isSubmitting ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.check_circle_outline, color: Colors.white),
                label: Text(_isSubmitting ? 'Saving...' : 'Submit & Notify Parent', style: const TextStyle(fontSize: 16, color: Colors.white)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1A73E8), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
              ),
            ),
          ],
        ),
      ),
    );
  }
}