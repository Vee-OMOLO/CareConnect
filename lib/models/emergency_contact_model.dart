class EmergencyContact {
  final String id;
  final String name;
  final String relation;     // 'Mother', 'Father', 'Doctor', etc.
  final String phone;
  final String childId;

  EmergencyContact({
    required this.id,
    required this.name,
    required this.relation,
    required this.phone,
    required this.childId,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'relation': relation,
    'phone': phone,
    'childId': childId,
  };

  factory EmergencyContact.fromMap(Map<String, dynamic> map) => EmergencyContact(
    id: map['id'] ?? '',
    name: map['name'] ?? '',
    relation: map['relation'] ?? '',
    phone: map['phone'] ?? '',
    childId: map['childId'] ?? '',
  );
}