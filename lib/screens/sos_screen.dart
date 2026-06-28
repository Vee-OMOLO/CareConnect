import 'package:flutter/material.dart';
import '../../services/firestore_service.dart';

class SOSScreen extends StatefulWidget {
  final String caregiverId;
  final String childId;
  const SOSScreen({super.key, required this.caregiverId, required this.childId});

  @override
  State<SOSScreen> createState() => _SOSScreenState();
}

class _SOSScreenState extends State<SOSScreen> {
  final _descriptionController = TextEditingController();
  bool _isTriggering = false;
  bool _triggered = false;

  Future<void> _triggerSOS() async {
    setState(() => _isTriggering = true);
    try {
      final String emergencyText = _descriptionController.text.isEmpty 
          ? 'Emergency — no description provided' 
          : _descriptionController.text;

      // 1. Execute her existing standard backend database trigger
      await FirestoreService().triggerSOS(
        childId: widget.childId, 
        caregiverId: widget.caregiverId, 
        location: 'GPS Pending Implementation',
        description: emergencyText,
      );

      // 2. MIRROR TO TIMELINE: Uses her built-in log method so the Parent Dashboard catches it perfectly
      await FirestoreService().logActivity(
        childId: widget.childId,
        caregiverId: widget.caregiverId,
        activityType: 'medicine', // Maps nicely to the red emergency style badge on parent side
        details: '🚨 EMERGENCY SOS ALERT: $emergencyText',
      );

      setState(() { _triggered = true; });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('SOS failed: $e'), backgroundColor: Colors.red));
    } finally {
      setState(() => _isTriggering = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SOS Emergency Alert'), backgroundColor: const Color(0xFFEA4335), foregroundColor: Colors.white),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: _triggered ? const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.check_circle_outline, size: 80, color: Color(0xFF34A853)), SizedBox(height: 16), Text('SOS Alert Sent!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)), SizedBox(height: 8), Text('Parents and emergency contacts have been notified.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey))]))
            : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Icon(Icons.warning_amber_rounded, size: 80, color: Color(0xFFEA4335)),
                    const SizedBox(height: 16),
                    const Text('Emergency SOS', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('This will immediately notify the parent and emergency contacts.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
                    const SizedBox(height: 24),
                    TextField(controller: _descriptionController, maxLines: 3, decoration: InputDecoration(labelText: 'Describe the emergency (optional)', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)))),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity, height: 58,
                      child: ElevatedButton.icon(
                        onPressed: _isTriggering ? null : _triggerSOS,
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA4335), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                        icon: _isTriggering ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.sos, color: Colors.white, size: 28),
                        label: Text(_isTriggering ? 'Sending Alert...' : 'SEND SOS ALERT', style: const TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}