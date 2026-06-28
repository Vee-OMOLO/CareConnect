class ActivityLog {
  final String id;
  final String childId;
  final String caregiverId;
  final String activityType;   // 'feeding', 'sleep', 'diaper', 'play', 'medicine'
  final String details;
  final DateTime timestamp;
  final String? mediaUrl;      // Optional photo

  ActivityLog({
    required this.id,
    required this.childId,
    required this.caregiverId,
    required this.activityType,
    required this.details,
    required this.timestamp,
    this.mediaUrl,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'childId': childId,
      'caregiverId': caregiverId,
      'activityType': activityType,
      'details': details,
      'timestamp': timestamp.toIso8601String(),
      'mediaUrl': mediaUrl,
    };
  }

  factory ActivityLog.fromMap(Map<String, dynamic> map) {
    return ActivityLog(
      id: map['id'] ?? '',
      childId: map['childId'] ?? '',
      caregiverId: map['caregiverId'] ?? '',
      activityType: map['activityType'] ?? '',
      details: map['details'] ?? '',
      timestamp: DateTime.parse(map['timestamp']),
      mediaUrl: map['mediaUrl'],
    );
  }
}