import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:image_picker/image_picker.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:care_connect/providers/auth_provider.dart';
import 'package:care_connect/services/location_service.dart';
import 'package:care_connect/services/firestore_service.dart';
import 'package:care_connect/utils/link_key.dart';
import 'safety_vault_screen.dart';
import 'sos_screen.dart';

class CaregiverDashboard extends StatefulWidget {
  const CaregiverDashboard({super.key});

  @override
  State<CaregiverDashboard> createState() => _CaregiverDashboardState();
}

class _CaregiverDashboardState extends State<CaregiverDashboard> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay = DateTime.now();
  final TextEditingController _childNameController = TextEditingController();
  final TextEditingController _parentEmailController = TextEditingController();

  @override
  void dispose() {
    _childNameController.dispose();
    _parentEmailController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    final caregiverId = FirebaseAuth.instance.currentUser?.uid;
    if (caregiverId != null) {
      LocationService(caregiverId).startTracking();
    }
  }

  // -------------------------------------------------------------------------
  // LINK PARENT DIALOG
  // -------------------------------------------------------------------------
  Future<void> _showLinkParentDialog(BuildContext context) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        bool isProcessing = false;

        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Link to Parent'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: _childNameController,
                    decoration: const InputDecoration(
                      labelText: "Child's Name",
                      hintText: 'e.g. Sophia',
                      border: OutlineInputBorder(),
                    ),
                    enabled: !isProcessing,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _parentEmailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: "Parent's Email",
                      hintText: 'e.g. parent@gmail.com',
                      border: OutlineInputBorder(),
                    ),
                    enabled: !isProcessing,
                  ),
                  if (isProcessing) ...[
                    const SizedBox(height: 16),
                    const LinearProgressIndicator(),
                  ]
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
                          final String childName =
                              _childNameController.text.trim();
                          final String parentEmail =
                              _parentEmailController.text.trim();

                          if (childName.isEmpty || parentEmail.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                    'Please enter both the child\'s name and the parent\'s email'),
                              ),
                            );
                            return;
                          }
                          if (!parentEmail.contains('@')) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Please enter a valid email'),
                              ),
                            );
                            return;
                          }

                          setDialogState(() => isProcessing = true);

                          try {
                            final caregiverUid =
                                FirebaseAuth.instance.currentUser?.uid;
                            if (caregiverUid == null) {
                              throw 'You are not signed in. Please log in again.';
                            }

                            final String linkKey =
                                buildLinkKey(parentEmail, childName);

                            await FirebaseFirestore.instance
                                .collection('users')
                                .doc(caregiverUid)
                                .set(
                              {
                                'linkedChildId': linkKey,
                                'linkedParentEmail': parentEmail.toLowerCase(),
                                'linkedChildName': childName,
                              },
                              SetOptions(merge: true),
                            );

                            if (context.mounted) {
                              await context.read<AuthProvider>().refreshUser();
                            }
                            if (dialogContext.mounted) {
                              Navigator.pop(dialogContext);
                            }
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Account Linked Successfully!'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            }
                            _childNameController.clear();
                            _parentEmailController.clear();
                          } catch (e) {
                            setDialogState(() => isProcessing = false);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content:
                                      Text('Failed to link: ${e.toString()}'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          }
                        },
                  child: const Text('Link Account'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    final String childId = user.linkedChildId ?? '';
    final bool isLinked = childId.isNotEmpty;

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        title: Text('Hi, ${user.name.split(' ')[0]} 👋'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.link, color: Colors.blue),
            tooltip: 'Link Parent',
            onPressed: () => _showLinkParentDialog(context),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.grey),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isLinked)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.amber.shade800),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Text(
                        'You are not linked to a parent yet. Tap the link icon '
                        'above and enter the child\'s name and parent\'s email.',
                        style: TextStyle(fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),

            _sosBanner(caregiverId: user.uid, childId: childId),
            const SizedBox(height: 24),

            // --- EVENT CALENDAR ---
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              padding: const EdgeInsets.all(8),
              child: Column(
                children: [
                  TableCalendar(
                    firstDay: DateTime.utc(2023, 1, 1),
                    lastDay: DateTime.utc(2030, 12, 31),
                    focusedDay: _focusedDay,
                    calendarFormat: CalendarFormat.week,
                    selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                    onDaySelected: (selectedDay, focusedDay) {
                      setState(() {
                        _selectedDay = selectedDay;
                        _focusedDay = focusedDay;
                      });
                    },
                    headerStyle: const HeaderStyle(
                      formatButtonVisible: false,
                      titleCentered: true,
                    ),
                    calendarStyle: const CalendarStyle(
                      selectedDecoration: BoxDecoration(
                        color: Color(0xFF1A73E8),
                        shape: BoxShape.circle,
                      ),
                      todayDecoration: BoxDecoration(
                        color: Color(0xFF94A3B8),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  const Divider(),
                  if (!isLinked)
                    const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text(
                        'Link to a parent to see scheduled events.',
                        style: TextStyle(color: Colors.grey),
                      ),
                    )
                  else
                    StreamBuilder<QuerySnapshot>(
                      stream: FirebaseFirestore.instance
                          .collection('child_events')
                          .where('childId', isEqualTo: childId)
                          .snapshots(),
                      builder: (context, snapshot) {
                        if (!snapshot.hasData) {
                          return const Padding(
                            padding: EdgeInsets.all(8.0),
                            child: CircularProgressIndicator(),
                          );
                        }

                        final dailyEvents = snapshot.data!.docs.where((doc) {
                          final eventDate =
                              (doc['date'] as Timestamp).toDate();
                          return isSameDay(eventDate, _selectedDay);
                        }).toList();

                        if (dailyEvents.isEmpty) {
                          return const Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Text(
                              'No events scheduled for this day.',
                              style: TextStyle(color: Colors.grey),
                            ),
                          );
                        }

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: dailyEvents.length,
                          itemBuilder: (context, index) {
                            return ListTile(
                              leading: const Icon(Icons.event_available,
                                  color: Color(0xFF1A73E8)),
                              title: Text(
                                dailyEvents[index]['title'],
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              ),
                              subtitle: Text(dailyEvents[index]['description']),
                            );
                          },
                        );
                      },
                    ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('Quick Log',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                _quickLogTile(
                  label: 'Feeding',
                  icon: Icons.restaurant_outlined,
                  color: const Color(0xFFFF6B35),
                  onTap: () => _openLog(context, 'feeding', user),
                ),
                _quickLogTile(
                  label: 'Sleep',
                  icon: Icons.bedtime_outlined,
                  color: const Color(0xFF6B48FF),
                  onTap: () => _openLog(context, 'sleep', user),
                ),
                _quickLogTile(
                  label: 'Diaper',
                  icon: Icons.baby_changing_station,
                  color: const Color(0xFF1A73E8),
                  onTap: () => _openLog(context, 'diaper', user),
                ),
                _quickLogTile(
                  label: 'Play / Activity',
                  icon: Icons.sports_soccer_outlined,
                  color: const Color(0xFF34A853),
                  onTap: () => _openLog(context, 'play', user),
                ),
                _quickLogTile(
                  label: 'Medicine',
                  icon: Icons.medication_outlined,
                  color: const Color(0xFFEA4335),
                  onTap: () => _openLog(context, 'medicine', user),
                ),
                _quickLogTile(
                  label: 'Emergency Vault',
                  icon: Icons.health_and_safety_outlined,
                  color: const Color(0xFF0F9D58),
                  onTap: () {
                    if (!isLinked) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Link to a parent first.'),
                          backgroundColor: Colors.orange,
                        ),
                      );
                      return;
                    }
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SafetyVaultScreen(childId: childId),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------------------
  // QUICK LOG — options + notes + OPTIONAL PHOTO (stored as Base64 in Firestore)
  // -------------------------------------------------------------------------
  Future<void> _openLog(BuildContext context, String type, dynamic user) async {
    final String childId = user.linkedChildId ?? '';

    if (childId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please link to a parent first.'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    final _LogResult? result = await _showLogSheet(context, type);
    if (result == null) return; // dismissed

    try {
      String? mediaData; // Base64 string (with a data: prefix) or null

      if (result.photo != null) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Processing photo…'),
              duration: Duration(seconds: 1),
            ),
          );
        }
        mediaData = await _encodePhotoBase64(result.photo!);
      }

      await FirestoreService().logActivity(
        childId: childId,
        caregiverId: user.uid,
        activityType: type,
        details: result.detail,
        mediaUrl: mediaData,
      );

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Logged: ${result.detail}'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to log: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Compresses the picked image hard (so it fits Firestore's 1MB doc limit)
  // and returns it as a base64 data URI string.
  Future<String> _encodePhotoBase64(XFile photo) async {
    final bytes = await photo.readAsBytes();
    final String b64 = base64Encode(bytes);
    // Prefix marks it as embedded base64 (vs a real http URL) so the parent
    // card knows to decode it with Image.memory.
    return 'data:image/jpeg;base64,$b64';
  }

  Future<_LogResult?> _showLogSheet(BuildContext context, String type) {
    final Map<String, List<String>> optionsByType = {
      'feeding': ['Skipped', 'Bottle', 'Solids'],
      'sleep': ['Started nap', 'Woke up'],
      'diaper': ['Wet', 'Dirty', 'Both'],
      'play': ['Indoor play', 'Outdoor play', 'Tummy time'],
      'medicine': ['Given', 'Skipped'],
    };
    final List<String> options = optionsByType[type] ?? ['Logged'];
    final String title = '${type[0].toUpperCase()}${type.substring(1)}';

    String? selected;
    XFile? pickedPhoto;
    final TextEditingController notesController = TextEditingController();
    final ImagePicker picker = ImagePicker();

    return showModalBottomSheet<_LogResult>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            // Compress hard at pick time so the base64 string stays small
            // enough for a Firestore document (~1MB limit).
            Future<void> pickFrom(ImageSource source) async {
              final XFile? img = await picker.pickImage(
                source: source,
                imageQuality: 35, // strong compression
                maxWidth: 500, // thumbnail-sized
              );
              if (img != null) {
                setSheetState(() => pickedPhoto = img);
              }
            }

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(sheetContext).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 16,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    Text('Log $title',
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: options.map((opt) {
                        final bool isSel = selected == opt;
                        return ChoiceChip(
                          label: Text(opt),
                          selected: isSel,
                          onSelected: (_) =>
                              setSheetState(() => selected = opt),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: notesController,
                      maxLines: 2,
                      decoration: InputDecoration(
                        labelText: 'Add notes (optional)',
                        hintText: 'e.g. amount, duration, reaction…',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    if (pickedPhoto != null) ...[
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: FutureBuilder<Uint8List>(
                          future: pickedPhoto!.readAsBytes(),
                          builder: (context, snap) {
                            if (!snap.hasData) {
                              return const SizedBox(
                                height: 140,
                                child: Center(
                                    child: CircularProgressIndicator()),
                              );
                            }
                            return Image.memory(
                              snap.data!,
                              height: 140,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton.icon(
                        onPressed: () =>
                            setSheetState(() => pickedPhoto = null),
                        icon: const Icon(Icons.close, size: 18),
                        label: const Text('Remove photo'),
                      ),
                    ] else
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => pickFrom(ImageSource.camera),
                              icon: const Icon(Icons.photo_camera_outlined),
                              label: const Text('Camera'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => pickFrom(ImageSource.gallery),
                              icon: const Icon(Icons.photo_library_outlined),
                              label: const Text('Gallery'),
                            ),
                          ),
                        ],
                      ),
                    const SizedBox(height: 16),

                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          final String note = notesController.text.trim();
                          final String chosen = selected ?? title;
                          final String detail =
                              note.isEmpty ? chosen : '$chosen — $note';
                          Navigator.pop(
                            sheetContext,
                            _LogResult(detail: detail, photo: pickedPhoto),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1A73E8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Save Log',
                            style: TextStyle(color: Colors.white)),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _quickLogTile({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: color.withValues(alpha: 0.1),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.black.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sosBanner({
    required String caregiverId,
    required String childId,
  }) {
    return GestureDetector(
      onTap: () {
        if (childId.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Link to a parent before sending an SOS.'),
              backgroundColor: Colors.orange,
            ),
          );
          return;
        }
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SOSScreen(
              caregiverId: caregiverId,
              childId: childId,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.red.shade50,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.red.shade200, width: 1),
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor: Colors.red.shade100,
              child: const Icon(Icons.error, color: Colors.red, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'URGENT SOS ALERT',
                    style: TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Emergency SOS Active. Tap to view details.',
                    style: TextStyle(
                      color: Colors.red.shade900,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 14, color: Colors.red.shade400),
          ],
        ),
      ),
    );
  }
}

// Carries the log sheet result back: the detail text and an optional photo.
class _LogResult {
  final String detail;
  final XFile? photo;
  const _LogResult({required this.detail, this.photo});
}