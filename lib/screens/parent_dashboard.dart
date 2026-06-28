import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:care_connect/providers/auth_provider.dart';
import 'package:care_connect/utils/link_key.dart';
import '../../services/firestore_service.dart';
import '../../models/activity_log_model.dart';
import 'safety_vault_screen.dart';
import 'parent_tracking_screen.dart';

class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});

  @override
  State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
  DateTime _selectedDate = DateTime.now();

  List<DateTime> _getCalendarDays() {
    final today = DateTime.now();
    return List.generate(7, (index) => today.subtract(Duration(days: index)))
        .reversed
        .toList();
  }

  // -------------------------------------------------------------------------
  // SET CHILD NAME
  // The parent enters their child's name once. We save it to their user doc as
  // `childName`. Combined with their login email, this builds the SAME key the
  // caregiver used when linking, so logs line up.
  // -------------------------------------------------------------------------
  Future<void> _showSetChildNameDialog(BuildContext context) async {
    final nameController = TextEditingController();
    bool isProcessing = false;

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text("Set Your Child's Name"),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Enter your child\'s name exactly as your caregiver will '
                    'type it when linking.',
                    style: TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: nameController,
                    decoration: const InputDecoration(
                      labelText: "Child's Name",
                      hintText: 'e.g. Sophia',
                      border: OutlineInputBorder(),
                    ),
                    enabled: !isProcessing,
                  ),
                  if (isProcessing) ...[
                    const SizedBox(height: 16),
                    const LinearProgressIndicator(),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed:
                      isProcessing ? null : () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: isProcessing
                      ? null
                      : () async {
                          final String childName = nameController.text.trim();
                          if (childName.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content:
                                      Text("Please enter the child's name")),
                            );
                            return;
                          }
                          setDialogState(() => isProcessing = true);
                          try {
                            final uid =
                                FirebaseAuth.instance.currentUser?.uid;
                            if (uid == null) {
                              throw 'You are not signed in.';
                            }
                            await FirebaseFirestore.instance
                                .collection('users')
                                .doc(uid)
                                .set(
                              {'childName': childName},
                              SetOptions(merge: true),
                            );
                            if (context.mounted) {
                              await context.read<AuthProvider>().refreshUser();
                            }
                            if (dialogContext.mounted) {
                              Navigator.pop(dialogContext);
                            }
                          } catch (e) {
                            setDialogState(() => isProcessing = false);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Failed: ${e.toString()}'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          }
                        },
                  child: const Text('Save'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _showAddEventDialog(BuildContext context, String childId) async {
    final titleController = TextEditingController();
    final descController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
            'Add Event for ${DateFormat('MMM d').format(_selectedDate)}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
                controller: titleController,
                decoration: const InputDecoration(
                    labelText: 'Event Title (e.g., Doctor Appt)')),
            TextField(
                controller: descController,
                decoration:
                    const InputDecoration(labelText: 'Time / Description')),
          ],
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              if (titleController.text.isEmpty) return;
              await FirebaseFirestore.instance.collection('child_events').add({
                'childId': childId,
                'title': titleController.text,
                'description': descController.text,
                'date': Timestamp.fromDate(_selectedDate),
                'createdAt': FieldValue.serverTimestamp(),
              });
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Add Event'),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalCalendar() {
    final days = _getCalendarDays();
    return Container(
      height: 90,
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: days.length,
        itemBuilder: (context, index) {
          final day = days[index];
          final bool isSelected = day.year == _selectedDate.year &&
              day.month == _selectedDate.month &&
              day.day == _selectedDate.day;

          return GestureDetector(
            onTap: () => setState(() => _selectedDate = day),
            child: Container(
              width: 60,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                gradient: isSelected
                    ? const LinearGradient(
                        colors: [Color(0xFF1A73E8), Color(0xFF6B48FF)])
                    : null,
                color: isSelected ? null : Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                      color: const Color(0xFF0F172A).withValues(alpha: 0.03),
                      blurRadius: 8,
                      offset: const Offset(0, 2))
                ],
                border: isSelected
                    ? null
                    : Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(DateFormat('E').format(day),
                      style: TextStyle(
                          fontSize: 12,
                          fontWeight:
                              isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected
                              ? Colors.white70
                              : const Color(0xFF64748B))),
                  const SizedBox(height: 4),
                  Text(DateFormat('d').format(day),
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: isSelected
                              ? Colors.white
                              : const Color(0xFF1E293B))),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLogsStream(String activeChildId) {
    return StreamBuilder<List<ActivityLog>>(
      stream: FirestoreService().getActivityLogsStream(activeChildId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
              child: CircularProgressIndicator(color: Color(0xFF1A73E8)));
        }

        final allLogs = snapshot.data ?? [];
        final filteredLogs = allLogs
            .where((log) =>
                log.timestamp.year == _selectedDate.year &&
                log.timestamp.month == _selectedDate.month &&
                log.timestamp.day == _selectedDate.day)
            .toList();
        filteredLogs.sort((a, b) => b.timestamp.compareTo(a.timestamp));

        if (filteredLogs.isEmpty) {
          return Expanded(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                          color:
                              const Color(0xFF1A73E8).withValues(alpha: 0.06),
                          shape: BoxShape.circle),
                      child: const Icon(Icons.child_care_rounded,
                          size: 54, color: Color(0xFF1A73E8))),
                  const SizedBox(height: 20),
                  Text(
                      'No activities logged for ${DateFormat('EEEE, MMM d').format(_selectedDate)}.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: Colors.black45,
                          fontSize: 14,
                          fontWeight: FontWeight.w500)),
                ],
              ),
            ),
          );
        }

        return Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            itemCount: filteredLogs.length,
            itemBuilder: (context, index) =>
                _ActivityCard(log: filteredLogs[index]),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    final String parentEmail = FirebaseAuth.instance.currentUser?.email ?? '';

    // The child's name the parent set for themselves (saved on their user doc).
    final String childName = user.childName ?? '';

    // Build the SAME key the caregiver built when linking.
    final String childId =
        childName.isNotEmpty ? buildLinkKey(parentEmail, childName) : '';

    final bool hasChild = childId.isNotEmpty;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Row(
          children: [
            Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    gradient: const LinearGradient(
                        colors: [Color(0xFF1A73E8), Color(0xFF6B48FF)]),
                    borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.child_care_rounded,
                    color: Colors.white, size: 20)),
            const SizedBox(width: 12),
            const Text("CareConnect",
                style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 19,
                    letterSpacing: -0.5,
                    color: Color(0xFF1E293B))),
          ],
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF1E293B),
        elevation: 0,
        actions: [
          if (hasChild)
            IconButton(
              icon: const Icon(Icons.location_on_rounded,
                  color: Color(0xFF34A853)),
              tooltip: 'Track Caregiver',
              onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => ParentTrackingScreen(childId: childId))),
            ),
          if (hasChild)
            IconButton(
              icon: const Icon(Icons.health_and_safety_outlined,
                  color: Color(0xFF1A73E8)),
              onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => SafetyVaultScreen(childId: childId))),
            ),
          IconButton(
              icon: const Icon(Icons.logout_rounded, color: Color(0xFF64748B)),
              onPressed: () => context.read<AuthProvider>().logout()),
          const SizedBox(width: 8),
        ],
      ),
      floatingActionButton: hasChild
          ? FloatingActionButton.extended(
              onPressed: () => _showAddEventDialog(context, childId),
              backgroundColor: const Color(0xFF1A73E8),
              icon: const Icon(Icons.add, color: Colors.white),
              label: const Text('Add Event',
                  style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
            )
          : null,
      body: hasChild
          ? Column(
              children: [
                _buildHorizontalCalendar(),
                _buildLogsStream(childId),
              ],
            )
          : Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.child_care_rounded,
                        size: 64, color: Color(0xFF1A73E8)),
                    const SizedBox(height: 16),
                    const Text(
                      'No child set up yet.',
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Add your child's name so your caregiver's logs and "
                      'alerts appear here. Use the same name the caregiver '
                      'enters when linking.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.black54),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: () => _showSetChildNameDialog(context),
                      icon: const Icon(Icons.add),
                      label: const Text("Set Child's Name"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1A73E8),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

// =============================================================================
// Activity card â€” renders one ActivityLog row on the parent dashboard.
// Reads: activityType, details, timestamp, mediaUrl.
// =============================================================================
class _ActivityCard extends StatelessWidget {
  final ActivityLog log;
  const _ActivityCard({required this.log});
 
  ({IconData icon, Color color}) _styleFor(String type) {
    switch (type.toLowerCase()) {
      case 'feeding':
        return (
          icon: Icons.restaurant_outlined,
          color: const Color(0xFFFF6B35)
        );
      case 'sleep':
        return (icon: Icons.bedtime_outlined, color: const Color(0xFF6B48FF));
      case 'diaper':
        return (
          icon: Icons.baby_changing_station,
          color: const Color(0xFF1A73E8)
        );
      case 'play':
        return (
          icon: Icons.sports_soccer_outlined,
          color: const Color(0xFF34A853)
        );
      case 'medicine':
        return (
          icon: Icons.medication_outlined,
          color: const Color(0xFFEA4335)
        );
      default:
        return (
          icon: Icons.event_note_outlined,
          color: const Color(0xFF64748B)
        );
    }
  }
 
  // Builds the photo widget: decodes base64 (data: prefix) or loads a URL.
  Widget? _buildPhoto(String? media) {
    if (media == null || media.isEmpty) return null;
 
    Widget image;
    if (media.startsWith('data:image')) {
      // base64 stored in Firestore
      try {
        final String b64 = media.substring(media.indexOf(',') + 1);
        final Uint8List bytes = base64Decode(b64);
        image = Image.memory(
          bytes,
          height: 120,
          width: double.infinity,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => const SizedBox.shrink(),
        );
      } catch (_) {
        return null;
      }
    } else {
      // a normal http(s) URL
      image = Image.network(
        media,
        height: 120,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const SizedBox.shrink(),
      );
    }
 
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: image,
    );
  }
 
  @override
  Widget build(BuildContext context) {
    final style = _styleFor(log.activityType);
 
    final String title = log.activityType.isEmpty
        ? 'Activity'
        : '${log.activityType[0].toUpperCase()}${log.activityType.substring(1)}';
 
    final String timeText = DateFormat('h:mm a').format(log.timestamp);
    final Widget? photo = _buildPhoto(log.mediaUrl);
 
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: style.color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(style.icon, color: style.color, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B),
                  ),
                ),
                if (log.details.trim().isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    log.details,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
                if (photo != null) ...[
                  const SizedBox(height: 8),
                  photo,
                ],
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            timeText,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Color(0xFF94A3B8),
            ),
          ),
        ],
      ),
    );
  }
}
