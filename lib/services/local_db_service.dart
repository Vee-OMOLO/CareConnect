import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/emergency_contact_model.dart';

class LocalDbService {
  static Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _initDatabase();
    return _db!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'care_connect_vault.db');

    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE emergency_contacts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            relation TEXT NOT NULL,
            phone TEXT NOT NULL,
            childId TEXT NOT NULL
          )
        ''');
      },
    );
  }

  Future<void> upsertContact(EmergencyContact contact) async {
    final db = await database;
    await db.insert(
      'emergency_contacts',
      contact.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<EmergencyContact>> getContacts(String childId) async {
    final db = await database;
    final maps = await db.query(
      'emergency_contacts',
      where: 'childId = ?',
      whereArgs: [childId],
    );
    return maps.map((m) => EmergencyContact.fromMap(m)).toList();
  }

  Future<void> syncContactsFromFirestore(List<EmergencyContact> contacts) async {
    for (final contact in contacts) {
      await upsertContact(contact);
    }
  }
}