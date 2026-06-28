class UserModel {
  final String uid;
  final String name;
  final String email;
  final String role;        // 'parent' or 'caregiver'
  final String? linkedChildId;
  final String? fcmToken;   // For push notifications
  final String? childName;

  UserModel({
    required this.uid,
    required this.name,
    required this.email,
    required this.role,
    this.linkedChildId,
    this.fcmToken,
    this.childName,
  });

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'role': role,
      'linkedChildId': linkedChildId,
      'fcmToken': fcmToken,
      'childName': childName,
    };
  }

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      role: map['role'] ?? 'parent',
      linkedChildId: map['linkedChildId'],
      fcmToken: map['fcmToken'],
      childName: map['childName'],
    );
  }
}