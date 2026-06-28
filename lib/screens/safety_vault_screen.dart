import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:uuid/uuid.dart';
import '../../models/emergency_contact_model.dart';
import '../../services/local_db_service.dart';
import '../../services/firestore_service.dart';

class SafetyVaultScreen extends StatefulWidget {
  final String childId;
  const SafetyVaultScreen({super.key, required this.childId});

  @override
  State<SafetyVaultScreen> createState() => _SafetyVaultScreenState();
}

class _SafetyVaultScreenState extends State<SafetyVaultScreen> {
  final _localDb = LocalDbService();
  final _firestoreService = FirestoreService();
  List<EmergencyContact> _contacts = [];
  bool _isLoading = true;

  @override
  void initState() { super.initState(); _loadContacts(); }

  Future<void> _loadContacts() async {
    final localContacts = await _localDb.getContacts(widget.childId);
    setState(() { _contacts = localContacts; _isLoading = false; });
    try {
      final onlineContacts = await _firestoreService.getEmergencyContacts(widget.childId);
      await _localDb.syncContactsFromFirestore(onlineContacts);
      setState(() { _contacts = onlineContacts; });
    } catch (_) {}
  }

  void _addContact() {
    showModalBottomSheet(
      context: context, isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => _AddContactSheet(childId: widget.childId, onAdded: (contact) async {
        await _localDb.upsertContact(contact);
        await _firestoreService.addEmergencyContact(childId: widget.childId, contact: contact);
        await _loadContacts();
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Safety Vault'), backgroundColor: const Color(0xFF0F9D58), foregroundColor: Colors.white),
      floatingActionButton: FloatingActionButton.extended(onPressed: _addContact, backgroundColor: const Color(0xFF0F9D58), icon: const Icon(Icons.add, color: Colors.white), label: const Text('Add Contact', style: TextStyle(color: Colors.white))),
      body: Column(
        children: [
          Container(width: double.infinity, color: const Color(0xFFE6F4EA), padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10), child: const Row(children: [Icon(Icons.offline_bolt, color: Color(0xFF0F9D58), size: 18), SizedBox(width: 8), Text('Available offline — always accessible in emergencies', style: TextStyle(color: Color(0xFF0F9D58), fontSize: 13))])),
          Expanded(
            child: _isLoading ? const Center(child: CircularProgressIndicator()) : _contacts.isEmpty ? const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.contacts, size: 64, color: Colors.grey), SizedBox(height: 12), Text('No emergency contacts yet', style: TextStyle(color: Colors.grey))]))
                : ListView.builder(padding: const EdgeInsets.all(16), itemCount: _contacts.length, itemBuilder: (context, i) {
                    final c = _contacts[i];
                    return Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: ListTile(
                        leading: CircleAvatar(backgroundColor: const Color(0xFFE6F4EA), child: Text(c.name[0], style: const TextStyle(color: Color(0xFF0F9D58), fontWeight: FontWeight.bold))),
                        title: Text(c.name, style: const TextStyle(fontWeight: FontWeight.bold)), subtitle: Text('${c.relation} • ${c.phone}'),
                        trailing: IconButton(icon: const Icon(Icons.call, color: Color(0xFF0F9D58)), onPressed: () { Clipboard.setData(ClipboardData(text: c.phone)); ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${c.phone} copied!'))); }),
                      ),
                    );
                  }),
          ),
        ],
      ),
    );
  }
}

class _AddContactSheet extends StatefulWidget {
  final String childId;
  final Function(EmergencyContact) onAdded;
  const _AddContactSheet({required this.childId, required this.onAdded});
  @override
  State<_AddContactSheet> createState() => _AddContactSheetState();
}

class _AddContactSheetState extends State<_AddContactSheet> {
  final _nameController = TextEditingController();
  final _relationController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(context).viewInsets.bottom + 20),
      child: Column(
        mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Add Emergency Contact', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          TextField(controller: _nameController, decoration: _dec('Full Name', Icons.person_outline)),
          const SizedBox(height: 12),
          TextField(controller: _relationController, decoration: _dec('Relation', Icons.family_restroom)),
          const SizedBox(height: 12),
          TextField(controller: _phoneController, keyboardType: TextInputType.phone, decoration: _dec('Phone Number', Icons.phone_outlined)),
          const SizedBox(height: 20),
          SizedBox(width: double.infinity, child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F9D58), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))), onPressed: () { widget.onAdded(EmergencyContact(id: const Uuid().v4(), name: _nameController.text, relation: _relationController.text, phone: _phoneController.text, childId: widget.childId)); Navigator.pop(context); }, child: const Text('Save Contact', style: TextStyle(color: Colors.white, fontSize: 15)))),
        ],
      ),
    );
  }
  InputDecoration _dec(String label, IconData icon) => InputDecoration(labelText: label, prefixIcon: Icon(icon, color: const Color(0xFF0F9D58)), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)));
}