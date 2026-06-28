/// Builds the shared link key used to connect a caregiver and a parent.
/// Both dashboards call this so they always compute the same childId.
/// Example: buildLinkKey('Lily@Gmail.com', ' Sophia ') -> 'lily@gmail.com_sophia'
String buildLinkKey(String parentEmail, String childName) {
  final email = parentEmail.trim().toLowerCase();
  final name = childName.trim().toLowerCase().replaceAll(RegExp(r'\s+'), ' ');
  return '${email}_$name';
}
