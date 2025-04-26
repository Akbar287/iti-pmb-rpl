import { JenisKelamin, Jenjang, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  
    await prisma.statusMahasiswaAssesment.createMany({
        data: [
          {
            NamaStatus: "Kelengkapan Form",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M14%206l7%207l-4%204%22%20%2F%3E%20%3Cpath%20d%3D%22M5.828%2018.172a2.828%202.828%200%200%200%204%200l10.586%20-10.586a2%202%200%200%200%200%20-2.829l-1.171%20-1.171a2%202%200%200%200%20-2.829%200l-10.586%2010.586a2.828%202.828%200%200%200%200%204z%22%20%2F%3E%20%3Cpath%20d%3D%22M4%2020l1.768%20-1.768%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 1,
            Keterangan: "Mahasiswa Melengkapi Form Asessment",
          },
          {
            NamaStatus: "Penunjukan Asesor",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M5%207a4%204%200%201%200%208%200a4%204%200%200%200%20-8%200%22%20%2F%3E%20%3Cpath%20d%3D%22M3%2021v-2a4%204%200%200%201%204%20-4h4c.96%200%201.84%20.338%202.53%20.901%22%20%2F%3E%20%3Cpath%20d%3D%22M16%203.13a4%204%200%200%201%200%207.75%22%20%2F%3E%20%3Cpath%20d%3D%22M16%2019h6%22%20%2F%3E%20%3Cpath%20d%3D%22M19%2016v6%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 2,
            Keterangan: "2 Asesor ditunjuk Kepala Prodi untuk Asessmen 1 Mahasiswa",
          },
          {
            NamaStatus: "Evaluasi Mandiri",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M12%2019h-7a2%202%200%200%201%20-2%20-2v-11a2%202%200%200%201%202%20-2h4l3%203h7a2%202%200%200%201%202%202v3.5%22%20%2F%3E%20%3Cpath%20d%3D%22M19%2016v6%22%20%2F%3E%20%3Cpath%20d%3D%22M22%2019l-3%203l-3%20-3%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 3,
            Keterangan: "Mahasiswa Melengkapi Evaluasi Mandiri",
          },
          {
            NamaStatus: "Hasil Asessmen",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M10%2019h-6a1%201%200%200%201%20-1%20-1v-14a1%201%200%200%201%201%20-1h6a2%202%200%200%201%202%202a2%202%200%200%201%202%20-2h6a1%201%200%200%201%201%201v14a1%201%200%200%201%20-1%201h-6a2%202%200%200%200%20-2%202a2%202%200%200%200%20-2%20-2z%22%20%2F%3E%20%3Cpath%20d%3D%22M12%205v16%22%20%2F%3E%20%3Cpath%20d%3D%22M7%207h1%22%20%2F%3E%20%3Cpath%20d%3D%22M7%2011h1%22%20%2F%3E%20%3Cpath%20d%3D%22M16%207h1%22%20%2F%3E%20%3Cpath%20d%3D%22M16%2011h1%22%20%2F%3E%20%3Cpath%20d%3D%22M16%2015h1%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 4,
            Keterangan: "Hasil Asessmen Sudah Selesai",
          },
          {
            NamaStatus: "Sanggahan",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M7%203h10a2%202%200%200%201%202%202v10m0%204a2%202%200%200%201%20-2%202h-10a2%202%200%200%201%20-2%20-2v-14%22%20%2F%3E%20%3Cpath%20d%3D%22M11%207h4%22%20%2F%3E%20%3Cpath%20d%3D%22M9%2011h2%22%20%2F%3E%20%3Cpath%20d%3D%22M9%2015h4%22%20%2F%3E%20%3Cpath%20d%3D%22M3%203l18%2018%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 5,
            Keterangan: "Mahasiswa Menyanggah Hasil Asessmen",
          },
          {
            NamaStatus: "Rekapitulasi Hasil",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M15%208h.01%22%20%2F%3E%20%3Cpath%20d%3D%22M11.5%2021h-5.5a3%203%200%200%201%20-3%20-3v-12a3%203%200%200%201%203%20-3h12a3%203%200%200%201%203%203v7%22%20%2F%3E%20%3Cpath%20d%3D%22M3%2016l5%20-5c.928%20-.893%202.072%20-.893%203%200l4%204%22%20%2F%3E%20%3Cpath%20d%3D%22M14%2014l1%20-1c.928%20-.893%202.072%20-.893%203%200l.5%20.5%22%20%2F%3E%20%3Cpath%20d%3D%22M15%2019l2%202l4%20-4%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 6,
            Keterangan: "Akademik Menyiapkan Sk. Rektor",
          },
          {
            NamaStatus: "SK. Rektor",
            Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M15%2015m-3%200a3%203%200%201%200%206%200a3%203%200%201%200%20-6%200%22%20%2F%3E%20%3Cpath%20d%3D%22M13%2017.5v4.5l2%20-1.5l2%201.5v-4.5%22%20%2F%3E%20%3Cpath%20d%3D%22M10%2019h-5a2%202%200%200%201%20-2%20-2v-10c0%20-1.1%20.9%20-2%202%20-2h14a2%202%200%200%201%202%202v10a2%202%200%200%201%20-1%201.73%22%20%2F%3E%20%3Cpath%20d%3D%22M6%209l12%200%22%20%2F%3E%20%3Cpath%20d%3D%22M6%2012l3%200%22%20%2F%3E%20%3Cpath%20d%3D%22M6%2015l2%200%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
            Urutan: 7,
            Keterangan: "Akademik Unggah Dokumen Sk. Rektor",
          },
        ],
    });

  await prisma.role.createMany({
    data: [
      {
        Name: "admin",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: "pmb",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: "akademik",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: "kaprodi",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: "asesor",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: "mahasiswa",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: "rektor",
        GuardName: "web",
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
    ],
  });

  await prisma.permission.createMany({
    data: [
      {
        Name: "user.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "user.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "user.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "user.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "role.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "role.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "role.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "role.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "role.assign",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "permission.assign",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "permission.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "permission.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "permission.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "permission.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.notify",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.upload",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "mahasiswa.import",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "form.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "form.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "form.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "form.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "eval.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "eval.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "eval.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "eval.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesor.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesor.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesor.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesor.assign",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesor.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesor.notify",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesmen.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesmen.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesmen.delete",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesmen.lock",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "asesmen.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "sanggahan.create",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "sanggahan.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "sanggahan.update",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "sanggahan.respond",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "rekapitulasi.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "rekapitulasi.generate",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "rekapitulasi.sign",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "rekapitulasi.distribute",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
      {
        Name: "dashboard.view",
        GuardName: "web",
        CreatedAt: new Date,
        UpdatedAt: new Date
      },
    ],
  });

  const role = await prisma.role.findMany();

  const relationRolePermission = [
    {
      role: "admin",
      permission: ["all"],
    },
    {
      role: "pmb",
      permission: [
        "mahasiswa.create",
        "mahasiswa.update",
        "mahasiswa.view",
        "mahasiswa.delete",
        "mahasiswa.notify",
        "mahasiswa.upload",
        "mahasiswa.import",
      ],
    },
    {
      role: "akademik",
      permission: [
        "asesmen.lock",
        "rekapitulasi.view",
        "rekapitulasi.generate",
        "rekapitulasi.sign",
        "rekapitulasi.distribute",
      ],
    },
    {
      role: "kaprodi",
      permission: [
        "asesor.create",
        "asesor.update",
        "asesor.delete",
        "asesor.assign",
        "asesor.view",
        "asesor.notify",
      ],
    },
    {
      role: "asesor",
      permission: [
        "sanggahan.view",
        "sanggahan.respond",
        "asesmen.create",
        "asesmen.update",
        "asesmen.delete",
        "asesmen.view",
      ],
    },
    {
      role: "mahasiswa",
      permission: [
        "form.create",
        "form.update",
        "form.view",
        "form.delete",
        "eval.create",
        "eval.update",
        "eval.view",
        "eval.delete",
        "sanggahan.create",
        "sanggahan.update",
        "sanggahan.view",
      ],
    },
    {
      role: "rektor",
      permission: ["dashboard.view"],
    },
  ];

  for (const r of role) {
    const matchedRole = relationRolePermission.find(
      (rel) => rel.role === r.Name
    );
    if (!matchedRole) continue;

    let permissionsToAssign = [];

    if (matchedRole.permission[0] === "all") {
      permissionsToAssign = await prisma.permission.findMany();
    } else {
      permissionsToAssign = await prisma.permission.findMany({
        where: {
          Name: {
            in: matchedRole.permission,
          },
        },
      });
    }

    for (const per of permissionsToAssign) {
      await prisma.roleHasPermissions.create({
        data: {
          RoleId: r.RoleId,
          PermissionId: per.PermissionId,
        },
      });
    }
  }

  let temp = await prisma.alamat.create({
    data: {
      DesaId: "d1856e8b-29d3-4cd2-b026-01ca59e9dd21",
      Alamat:
        "Jl. Puspitek, Setu, Kec. Serpong, Kota Tangerang Selatan, Banten",
      KodePos: "15314",
    },
  });

  const university = await prisma.university.create({
    data: {
      Nama: "Institut Teknologi Indonesia",
      Akreditasi: "A",
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      DeletedAt: null,
      AlamatId: temp.AlamatId,
    },
  });

  await prisma.programStudi.createMany({
    data: [
      {
        UniversityId: university.UniversityId,
        Nama: "Teknik Informatika",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Teknik Elektro",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Teknik Mesin",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Teknik Industri",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Teknik Kimia",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Teknik Sipil",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Arsitektur",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Perencanaan Wilayah dan Kota",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Teknologi Industri Pertanian",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
      {
        UniversityId: university.UniversityId,
        Nama: "Manajemen",
        Jenjang: Jenjang.S1,
        Akreditasi: "A",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
  });

  const prodiMataKuliah = [
    {
      Nama: "Teknik Informatika",
      mata_kuliah: [
        {
          kode: "IF 12101",
          nama: "Agama Islam",
          sks: 2,
        },
        {
          kode: "IF 12102",
          nama: "Agama Kristen Protestan",
          sks: 2,
        },
        {
          kode: "IF 12103",
          nama: "Agama Kristen Katholik",
          sks: 2,
        },
        {
          kode: "IF 12104",
          nama: "Agama Buddha/Hindu",
          sks: 2,
        },
        {
          kode: "IF 12108",
          nama: "Matematika 1",
          sks: 3,
        },
        {
          kode: "IF 12112",
          nama: "Bahasa Inggris",
          sks: 2,
        },
        {
          kode: "IF 12109",
          nama: "Transformasi Digital ",
          sks: 2,
        },
        {
          kode: "IF 32101",
          nama: "Pemrograman Dasar",
          sks: 4,
        },
        {
          kode: "IF 32102",
          nama: "Dasar Sistem Digital",
          sks: 3,
        },
        {
          kode: "IF 32103",
          nama: "Statistika 1",
          sks: 3,
        },
        {
          kode: "IF 32104",
          nama: "Struktur Data",
          sks: 3,
        },
        {
          kode: "IF 32105",
          nama: "Matematika 2",
          sks: 2,
        },
        {
          kode: "IF 32106",
          nama: "Interaksi Manusia dan Komputer",
          sks: 3,
        },
        {
          kode: "IF 32103",
          nama: "Matematika Diskrit",
          sks: 3,
        },
        {
          kode: "IF 32107",
          nama: "Pemrograman Berorientasi Objek",
          sks: 3,
        },
        {
          kode: "IF 32108",
          nama: "Dasar Arsitektur dan Organisasi Komputer",
          sks: 3,
        },
        {
          kode: "IF 32109",
          nama: "Statistika 2",
          sks: 2,
        },
        {
          kode: "IF 12107",
          nama: "Bahasa Indonesia",
          sks: 2,
        },
        {
          kode: "IF 32110",
          nama: "Aljabar Linier",
          sks: 3,
        },
        {
          kode: "IF 32146",
          nama: "Analisis dan Perancangan Sistem",
          sks: 3,
        },
        {
          kode: "IF 32112",
          nama: "Pemrograman Visual",
          sks: 3,
        },
        {
          kode: "IF 32113",
          nama: "Database 1",
          sks: 3,
        },
        {
          kode: "IF 32115",
          nama: "Sistem Operasi",
          sks: 3,
        },
        {
          kode: "IF 12106",
          nama: "Kewarganegaraan",
          sks: 2,
        },
        {
          kode: "IF 12110",
          nama: "Dasar Kewirausahaan",
          sks: 2,
        },
        {
          kode: "IF 32125",
          nama: "Pemrograman Berbasis Web",
          sks: 3,
        },
        {
          kode: "IF 32117",
          nama: "Rekayasa Perangkat Lunak",
          sks: 3,
        },
        {
          kode: "IF 32119",
          nama: "Database 2",
          sks: 2,
        },
        {
          kode: "IF 32120",
          nama: "Jaringan Komputer",
          sks: 3,
        },
        {
          kode: "IF 32111",
          nama: "Perancangan dan Analisa Algoritma",
          sks: 3,
        },
        {
          kode: "IF 32114",
          nama: "Kecerdasan Buatan",
          sks: 2,
        },
        {
          kode: "IF 12111",
          nama: "Kewirausahaan Lanjut",
          sks: 3,
        },
        {
          kode: "IF 32118",
          nama: "Machine Learning",
          sks: 3,
        },
        {
          kode: "IF 32122",
          nama: "Teknologi Multimedia",
          sks: 3,
        },
        {
          kode: "IF 32123",
          nama: "Kecakapan Antar Personal",
          sks: 3,
        },
        {
          kode: "IF 32124",
          nama: "Sistem Informasi",
          sks: 3,
        },
        {
          kode: "IF 32116",
          nama: "Teknik Riset Operasional",
          sks: 2,
        },
        {
          kode: "IF 32126",
          nama: "Mobile Cloud Computing",
          sks: 3,
        },
        {
          kode: "IF 32127",
          nama: "Pemrograman Aplikasi Mobile",
          sks: 3,
        },
        {
          kode: "IF 32128",
          nama: "Jaringan Komputer Lanjut",
          sks: 3,
        },
        {
          kode: "IF 32129",
          nama: "Keamanan Informasi",
          sks: 3,
        },
        {
          kode: "IF 32130",
          nama: "Sistem Paralel dan Terdistribusi",
          sks: 3,
        },
        {
          kode: "IF 32131",
          nama: "Pemodelan dan Simulasi",
          sks: 3,
        },
        {
          kode: "IF 32121",
          nama: "Grafika Komputer",
          sks: 3,
        },
        {
          kode: "IF 42101",
          nama: "Kerja Praktek",
          sks: 2,
        },
        {
          kode: "IF 32132",
          nama: "Data Visualization",
          sks: 2,
        },
        {
          kode: "IF 42125",
          nama: "IT Project",
          sks: 3,
        },
        {
          kode: "IF 32133",
          nama: "Natural Language Processing / Pemrosesan Bahasa Natural",
          sks: 3,
        },
        {
          kode: "IF 32134",
          nama: "Data Mining",
          sks: 2,
        },
        {
          kode: "IF 32135",
          nama: "Etika Profesi",
          sks: 2,
        },
        {
          kode: "IF 42104",
          nama: "Pegembangan Aplikasi Enterprise",
          sks: 2,
        },
        {
          kode: "IF 42107",
          nama: "Pengolahan Citra",
          sks: 2,
        },
        {
          kode: "IF 42108",
          nama: "eCommerce",
          sks: 2,
        },
        {
          kode: "IF 42110",
          nama: "Penjaminan Mutu Perangkat Lunak",
          sks: 2,
        },
        {
          kode: "IF 32111",
          nama: "Pemrograman Game",
          sks: 3,
        },
        {
          kode: "IF 42112",
          nama: "Pemrograman Semantik Web",
          sks: 2,
        },
        {
          kode: "IF 42113",
          nama: "Big Data Analytic",
          sks: 2,
        },
        {
          kode: "IF 42115",
          nama: "Digital Forensic",
          sks: 2,
        },
        {
          kode: "IF 42116",
          nama: "Kriptografi",
          sks: 3,
        },
        {
          kode: "IF 42119",
          nama: "Pengembangan Microservices",
          sks: 2,
        },
        {
          kode: "IF 42120",
          nama: "Internet of Things",
          sks: 2,
        },
        {
          kode: "IF 42121",
          nama: "Administrasi Sistem",
          sks: 2,
        },
        {
          kode: "IF 42123",
          nama: "Network Security",
          sks: 2,
        },
      ],
    },
    {
      Nama: "Teknik Elektro",
      mata_kuliah: [],
    },
    {
      Nama: "Teknik Mesin",
      mata_kuliah: [
        {
          kode: "MS 32101",
          nama: "Fisika Dasar I",
          sks: 2,
        },
        {
          kode: "MS 12108",
          nama: "Matematika I",
          sks: 3,
        },
        {
          kode: "MS 32102",
          nama: "Kimia Dasar",
          sks: 2,
        },
        {
          kode: "MS 32103",
          nama: "Menggambar Teknik",
          sks: 2,
        },
        {
          kode: "MS 12101",
          nama: "Agama Islam",
          sks: 2,
        },
        {
          kode: "MS 12102",
          nama: "Agama Kristen Protestan",
          sks: 2,
        },
        {
          kode: "MS 12103",
          nama: "Agama Kristen Katholik",
          sks: 2,
        },
        {
          kode: "MS 12104",
          nama: "Agama Buddha",
          sks: 2,
        },
        {
          kode: "MS 12104",
          nama: "Agama Hindu",
          sks: 2,
        },
        {
          kode: "MS 12105",
          nama: "Pancasila",
          sks: 2,
        },
        {
          kode: "MS 12107",
          nama: "Bahasa Indonesia",
          sks: 2,
        },
        {
          kode: "MS 12112",
          nama: "Bahasa Inggris",
          sks: 2,
        },
        {
          kode: "MS 12109",
          nama: "Transformasi Digital",
          sks: 2,
        },
        {
          kode: "MS 32104",
          nama: "Praktikum Kimia Dasar",
          sks: 1,
        },
        {
          kode: "MS 32105",
          nama: "Fisika Dasar II",
          sks: 3,
        },
        {
          kode: "MS 32106",
          nama: "Matematika II",
          sks: 3,
        },
        {
          kode: "MS 32107",
          nama: "Menggambar Mesin Berbasis Komputer",
          sks: 3,
        },
        {
          kode: "MS 32108",
          nama: "Praktikum Fisika Dasar",
          sks: 1,
        },
        {
          kode: "MS 32109",
          nama: "Statika Struktur",
          sks: 3,
        },
        {
          kode: "MS 32110",
          nama: "Material Teknik",
          sks: 3,
        },
        {
          kode: "MS 32111",
          nama: "Keselamatan Kesehatan Kerja dan Lingkungan",
          sks: 2,
        },
        {
          kode: "MS 12106",
          nama: "Kewarganegaraan",
          sks: 2,
        },
        {
          kode: "MS 32127",
          nama: "Statistik",
          sks: 2,
        },
        {
          kode: "MS 32113",
          nama: "Metalurgi Fisik",
          sks: 3,
        },
        {
          kode: "MS 32114",
          nama: "Teknik Tenaga Listrik",
          sks: 2,
        },
        {
          kode: "MS 32115",
          nama: "Kinematika",
          sks: 2,
        },
        {
          kode: "MS 32116",
          nama: "Mekanika Kekuatan Material",
          sks: 3,
        },
        {
          kode: "MS 32117",
          nama: "Mekanika Fluida I",
          sks: 2,
        },
        {
          kode: "MS 32118",
          nama: "Termodinamika Dasar",
          sks: 2,
        },
        {
          kode: "MS 32119",
          nama: "Otomatisasi dan Sistem Servo",
          sks: 2,
        },
        {
          kode: "MS 32121",
          nama: "Simulasi Numerik",
          sks: 3,
        },
        {
          kode: "MS 32120",
          nama: "Prak, Rekayasa Material",
          sks: 1,
        },
        {
          kode: "MS 12110",
          nama: "Dasar Kewirausahaan",
          sks: 2,
        },
        {
          kode: "MS 32122",
          nama: "Mekanika Fluida II",
          sks: 2,
        },
        {
          kode: "MS 32123",
          nama: "Mekatronika",
          sks: 2,
        },
        {
          kode: "MS 32124",
          nama: "Elemen Mesin I",
          sks: 2,
        },
        {
          kode: "MS 32125",
          nama: "Dinamika Teknik",
          sks: 2,
        },
        {
          kode: "MS 32126",
          nama: "Termodinamika Teknik",
          sks: 3,
        },
        {
          kode: "MS 32112",
          nama: "Matematika Teknik I",
          sks: 3,
        },
        {
          kode: "MS 32128",
          nama: "Perpindahan Panas",
          sks: 3,
        },
        {
          kode: "MS 32129",
          nama: "Elemen Mesin II",
          sks: 2,
        },
        {
          kode: "MS 32130",
          nama: "Pengukuran Teknik",
          sks: 2,
        },
        {
          kode: "MS 42101",
          nama: "Matematika Teknik II",
          sks: 3,
        },
        {
          kode: "MS 42102",
          nama: "Motor Bakar Torak",
          sks: 2,
        },
        {
          kode: "MS 42103",
          nama: "Prakt. Fenomena Dasar Mesin",
          sks: 1,
        },
        {
          kode: "MS 12111",
          nama: "Kewirausahaan Lanjut",
          sks: 3,
        },
        {
          kode: "MS 42104",
          nama: "Proses Produksi",
          sks: 3,
        },
        {
          kode: "MS 42105",
          nama: "Prakt. Proses Produksi",
          sks: 1,
        },
        {
          kode: "MS 42105",
          nama: "Mesin Konversi Energi",
          sks: 3,
        },
        {
          kode: "MS 42107",
          nama: "Elemen Mesin III",
          sks: 2,
        },
        {
          kode: "MS 42109",
          nama: "Praktikum Prestasi Mesin",
          sks: 1,
        },
        {
          kode: "MS 42110",
          nama: "Perawatan Mesin",
          sks: 2,
        },
        {
          kode: "MS 42111",
          nama: "Getaran Mekanis",
          sks: 3,
        },
        {
          kode: "MS 42112",
          nama: "Teknik Pengaturan",
          sks: 2,
        },
        {
          kode: "MS 42113",
          nama: "Kerja Praktek + Seminar",
          sks: 3,
        },
        {
          kode: "MS 42114",
          nama: "Meterologi Industri & Statistik",
          sks: 2,
        },
        {
          kode: "MS 42115",
          nama: "Konstruksi Mesin",
          sks: 3,
        },
        {
          kode: "MS 42117",
          nama: "Teknologi Pembentukan",
          sks: 3,
        },
        {
          kode: "3211312",
          nama: "Aerodinamika Pesawat Terbang I",
          sks: 3,
        },
        {
          kode: "5411225",
          nama: "Performa Pesawat Terbang",
          sks: 3,
        },
        {
          kode: "MS 322101",
          nama: "Kuliah Kerja Nyata",
          sks: 2,
        },
        {
          kode: "MS 42129",
          nama: "Alat Pengangkat",
          sks: 2,
        },
        {
          kode: "MS 42130",
          nama: "Pneumatik & Hidraulik",
          sks: 2,
        },
        {
          kode: "MS 42131",
          nama: "Elemen Hingga",
          sks: 2,
        },
        {
          kode: "MS 42132",
          nama: "Fatigue",
          sks: 2,
        },
        {
          kode: "MS 42133",
          nama: "Otomasi dan Robotika",
          sks: 2,
        },
        {
          kode: "MS 42134",
          nama: "Kebisingan dan Getaran",
          sks: 2,
        },
        {
          kode: "MS 42141",
          nama: "Teknik Pendingin",
          sks: 2,
        },
        {
          kode: "MS 42142",
          nama: "Ketel Uap",
          sks: 2,
        },
        {
          kode: "MS 42143",
          nama: "Turbin Gas",
          sks: 2,
        },
        {
          kode: "MS 42144",
          nama: "Pompa Dan Kompresor",
          sks: 2,
        },
        {
          kode: "MS 42145",
          nama: "Dinamika Gas",
          sks: 2,
        },
        {
          kode: "MS 42146",
          nama: "Teknik Pembakaran",
          sks: 2,
        },
        {
          kode: "MS 42135",
          nama: "Teknologi Pengelasan",
          sks: 2,
        },
        {
          kode: "MS 42136",
          nama: "CNC",
          sks: 2,
        },
        {
          kode: "MS 42137",
          nama: "Sistem Produksi",
          sks: 2,
        },
        {
          kode: "MS 42138",
          nama: "Non-Destructive Inspection",
          sks: 2,
        },
        {
          kode: "MS 42139",
          nama: "Penilaian Kinerja Manufaktur",
          sks: 2,
        },
        {
          kode: "MS 42140",
          nama: "Korosi dan Pencegahannya",
          sks: 2,
        },
      ],
    },
    {
      Nama: "Teknik Industri",
      mata_kuliah: [],
    },
    {
      Nama: "Teknik Kimia",
      mata_kuliah: [],
    },
    {
      Nama: "Teknik Sipil",
      mata_kuliah: [],
    },
    {
      Nama: "Arsitektur",
      mata_kuliah: [
        {
          kode: "AR 12101",
          nama: "Agama Islam",
          sks: 2,
        },
        {
          kode: "AR 12102",
          nama: "Agama Protestan",
          sks: 2,
        },
        {
          kode: "AR 12103",
          nama: "Agama Katholik",
          sks: 2,
        },
        {
          kode: "AR 12104",
          nama: "Agama Hindu/ Buddha/ Konghucu",
          sks: 2,
        },
        {
          kode: "AR 12108",
          nama: "Matematika",
          sks: 2,
        },
        {
          kode: "AR 32101",
          nama: "Mekanika Teknik",
          sks: 3,
        },
        {
          kode: "AR 32102",
          nama: "Pengantar Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 32103",
          nama: "Pengenalan Bahan ",
          sks: 2,
        },
        {
          kode: "AR 32104",
          nama: "Studio Arsitektur I",
          sks: 4,
        },
        {
          kode: "AR 12109",
          nama: "Transformasi Digital",
          sks: 2,
        },
        {
          kode: "AR 32105",
          nama: "Teknologi Bangunan Sederhana",
          sks: 2,
        },
        {
          kode: "AR 32106",
          nama: "Arsitektur dan Lingkungan",
          sks: 2,
        },
        {
          kode: "AR 12112",
          nama: "Bahasa Inggris",
          sks: 2,
        },
        {
          kode: "AR 32107",
          nama: "Metoda Perancangan I",
          sks: 2,
        },
        {
          kode: "AR 32108",
          nama: "Praktikum Teknologi Bangunan Tropis I",
          sks: 2,
        },
        {
          kode: "AR 32109",
          nama: "Studio Arsitektur II",
          sks: 4,
        },
        {
          kode: "AR 32110",
          nama: "Teknologi Bahan ",
          sks: 2,
        },
        {
          kode: "AR 32111",
          nama: "Teknologi Bangunan Tropis I",
          sks: 2,
        },
        {
          kode: "AR 32112",
          nama: "Teori Arsitektur",
          sks: 3,
        },
        {
          kode: "AR 12107",
          nama: "Bahasa Indonesia",
          sks: 2,
        },
        {
          kode: "AR 32113",
          nama: "Komputer dalam Arsitektur",
          sks: 3,
        },
        {
          kode: "AR 12105",
          nama: "Pancasila",
          sks: 2,
        },
        {
          kode: "AR 32114",
          nama: "Perancangan Tapak",
          sks: 2,
        },
        {
          kode: "AR 32115",
          nama: "Praktikum Teknologi Bangunan Tropis II",
          sks: 2,
        },
        {
          kode: "AR 32117",
          nama: "Sejarah Arsitektur I",
          sks: 2,
        },
        {
          kode: "AR 32118",
          nama: "Studio Perancangan Arsitektur I",
          sks: 6,
        },
        {
          kode: "AR 32119",
          nama: "Teknologi Bangunan Tropis II",
          sks: 2,
        },
        {
          kode: "AR 12110",
          nama: "Dasar Kewirausahaan ",
          sks: 2,
        },
        {
          kode: "AR 12106",
          nama: "Kewarganegaraan",
          sks: 2,
        },
        {
          kode: "AR 32121",
          nama: "Metoda Perancangan II",
          sks: 2,
        },
        {
          kode: "AR 32122",
          nama: "Sejarah Arsitektur II",
          sks: 2,
        },
        {
          kode: "AR 32123",
          nama: "Sistem Kelengkapan Bangunan",
          sks: 3,
        },
        {
          kode: "AR 32124",
          nama: "Studio Perancangan Arsitektur II",
          sks: 6,
        },
        {
          kode: "AR 32125",
          nama: "Teknologi Bangunan Rendah",
          sks: 2,
        },
        {
          kode: "AR 32126",
          nama: "Perencanaan dan Perancangan Kota",
          sks: 2,
        },
        {
          kode: "AR 12111",
          nama: "Kewirausahaan Lanjut",
          sks: 3,
        },
        {
          kode: "AR 32127",
          nama: "Metoda Penelitian Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 32128",
          nama: "Perumahan dan Pembangunan Perkotaan",
          sks: 2,
        },
        {
          kode: "AR 32116",
          nama: "Pranata Pembangunan",
          sks: 2,
        },
        {
          kode: "AR 32129",
          nama: "Studio Perancangan Arsitektur III",
          sks: 6,
        },
        {
          kode: "AR 32130",
          nama: "Teknologi Bangunan Bentang Lebar",
          sks: 2,
        },
        {
          kode: "AR 32131",
          nama: "Teori Kritik Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 42101",
          nama: "Kerja Praktik",
          sks: 3,
        },
        {
          kode: "AR 32120",
          nama: "Komunikasi Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 42102",
          nama: "Perilaku Berprofesi",
          sks: 2,
        },
        {
          kode: "AR 32132",
          nama: "Studio Perancangan Arsitektur IV",
          sks: 6,
        },
        {
          kode: "AR 32133",
          nama: "Teknologi Bangunan Tinggi",
          sks: 2,
        },
        {
          kode: "AR 42105",
          nama: "Arsitektur Bentang Alam",
          sks: 2,
        },
        {
          kode: "AR 42106",
          nama: "Arsitektur Hijau",
          sks: 2,
        },
        {
          kode: "AR 42107",
          nama: "Desain Industrial",
          sks: 2,
        },
        {
          kode: "AR 42108",
          nama: "Digitalisasi Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 42109",
          nama: "Manajemen Proyek/ Pembangunan",
          sks: 2,
        },
        {
          kode: "AR 42111",
          nama: "Revitalisasi Kawasan Perkotaan",
          sks: 2,
        },
        {
          kode: "AR 42103",
          nama: "Arsitektur Interior",
          sks: 2,
        },
        {
          kode: "AR 42104",
          nama: "Kota terpadu dan Berkelanjutan",
          sks: 3,
        },
        {
          kode: "AR 42112",
          nama: "Arsitektur Intelijen",
          sks: 2,
        },
        {
          kode: "AR 42113",
          nama: "Arsitektur Vernakular",
          sks: 2,
        },
        {
          kode: "AR 42114",
          nama: "Konservasi Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 42115",
          nama: "Perencanaan Dan Perancangan Perumahan",
          sks: 2,
        },
        {
          kode: "AR 42116",
          nama: "Perilaku Arsitektur",
          sks: 2,
        },
        {
          kode: "AR 42117",
          nama: "Tipologi dan Morfologi Bangunan",
          sks: 2,
        },
      ],
    },
    {
      Nama: "Perencanaan Wilayah dan Kota",
      mata_kuliah: [],
    },
    {
      Nama: "Teknologi Industri Pertanian",
      mata_kuliah: [
        {
          kode: "TIP12101",
          nama: "Pendidikan Agama Islam",
          sks: 2,
        },
        {
          kode: "TIP12102",
          nama: "Pendidikan Agama Kristen Protestan",
          sks: 2,
        },
        {
          kode: "TIP12103",
          nama: "Pendidikan Agama Kristen Katolik",
          sks: 2,
        },
        {
          kode: "TIP12104",
          nama: "Pendidikan Agama Hindu",
          sks: 2,
        },
        {
          kode: "TIP12104",
          nama: "Pendidikan Agama Budha",
          sks: 2,
        },
        {
          kode: "TIP12107",
          nama: "Bahasa Indonesia",
          sks: 2,
        },
        {
          kode: "TIP12109",
          nama: "Transformasi Digital",
          sks: 2,
        },
        {
          kode: "TIP32101",
          nama: "Biologi",
          sks: 2,
        },
        {
          kode: "TIP32102",
          nama: "Praktikum Biologi",
          sks: 1,
        },
        {
          kode: "TIP32103",
          nama: "Fisika Dasar I",
          sks: 2,
        },
        {
          kode: "TIP32104",
          nama: "Praktikum Fisika Dasar I",
          sks: 1,
        },
        {
          kode: "TIP32105",
          nama: "Kimia Dasar",
          sks: 2,
        },
        {
          kode: "TIP32106",
          nama: "Praktikum Kimia Dasar",
          sks: 1,
        },
        {
          kode: "TIP12108",
          nama: "Matematika I",
          sks: 3,
        },
        {
          kode: "TIP32107",
          nama: "Pengantar Agroindustri",
          sks: 2,
        },
        {
          kode: "TIP32108",
          nama: "Pengantar Bioteknologi",
          sks: 2,
        },
        {
          kode: "TIP32109",
          nama: "Manajemen SDM",
          sks: 2,
        },
        {
          kode: "TIP32110",
          nama: "Fisika Dasar II",
          sks: 2,
        },
        {
          kode: "TIP32111",
          nama: "Menggambar Teknik",
          sks: 2,
        },
        {
          kode: "TIP32112",
          nama: "Matematika Industri",
          sks: 3,
        },
        {
          kode: "TIP32113",
          nama: "Pengetahuan Lingkungan",
          sks: 2,
        },
        {
          kode: "TIP32114",
          nama: "Kimia Organik",
          sks: 2,
        },
        {
          kode: "TIP32115",
          nama: "Praktikum Kimia Organik",
          sks: 1,
        },
        {
          kode: "TIP32116",
          nama: "Biokimia",
          sks: 2,
        },
        {
          kode: "TIP32117",
          nama: "	Praktikum Biokimia",
          sks: 1,
        },
        {
          kode: "TIP12112",
          nama: "Bahasa Inggris",
          sks: 2,
        },
        {
          kode: "TIP32118",
          nama: "Mesin dan Instrumentasi Industri",
          sks: 3,
        },
        {
          kode: "TIP32119",
          nama: "Biologi Sel Molekuler",
          sks: 2,
        },
        {
          kode: "TIP32120",
          nama: "Penerapan Komputer",
          sks: 2,
        },
        {
          kode: "TIP32121",
          nama: "Praktikum Penerapan Komputer",
          sks: 1,
        },
        {
          kode: "TIP12105",
          nama: "Pancasila",
          sks: 2,
        },
        {
          kode: "TIP32122",
          nama: "Pengetahuan Bahan Agroindustri",
          sks: 2,
        },
        {
          kode: "TIP32123",
          nama: "Dasar Teknik Rekayasa Proses",
          sks: 2,
        },
        {
          kode: "TIP32124",
          nama: "Praktikum Dasar Teknik Rekayasa Proses",
          sks: 1,
        },
        {
          kode: "TIP32125",
          nama: "Ekonomi Industri",
          sks: 2,
        },
        {
          kode: "TIP32126",
          nama: "Statistika Industri",
          sks: 3,
        },
        {
          kode: "TIP32127",
          nama: "Tata Letak dan Penanganan Bahan",
          sks: 2,
        },
        {
          kode: "TIP32128",
          nama: "Kimia Industri",
          sks: 3,
        },
        {
          kode: "TIP32129",
          nama: "Satuan Proses",
          sks: 2,
        },
        {
          kode: "TIP12110",
          nama: "Dasar Kewirausahaan",
          sks: 2,
        },
        {
          kode: "TIP32130",
          nama: "Sosiologi Industri",
          sks: 2,
        },
        {
          kode: "TIP32131",
          nama: "Praktikum Satuan Proses",
          sks: 1,
        },
        {
          kode: "TIP32132",
          nama: "Regulasi Pangan dan Bioteknologi",
          sks: 2,
        },
        {
          kode: "TIP42101",
          nama: "Ilmu Gizi",
          sks: 2,
        },
        {
          kode: "TIP42102",
          nama: "Genetika",
          sks: 2,
        },
        {
          kode: "TIP42103",
          nama: "Praktikum Genetika",
          sks: 1,
        },
        {
          kode: "TIP12111",
          nama: "Kewirausahaan Lanjut",
          sks: 3,
        },
        {
          kode: "TIP32133",
          nama: "Analisis Bahan Hasil Pertanian",
          sks: 3,
        },
        {
          kode: "TIP32134",
          nama: "Praktikum Analisis Bahan Hasil Pertanian",
          sks: 1,
        },
        {
          kode: "TIP32135",
          nama: "Mikrobiologi Industri",
          sks: 2,
        },
        {
          kode: "TIP32136",
          nama: "Praktikum Mikrobiologi Industri",
          sks: 1,
        },
        {
          kode: "TIP32137",
          nama: "Satuan Operasi",
          sks: 2,
        },
        {
          kode: "TIP32138",
          nama: "Pengawasan Mutu",
          sks: 2,
        },
        {
          kode: "TIP32139",
          nama: "Metode Ilmiah",
          sks: 2,
        },
        {
          kode: "TIP32140",
          nama: "Pengujian Sensoris",
          sks: 2,
        },
        {
          kode: "TIP32141",
          nama: "Manajemen Lingkungan",
          sks: 3,
        },
        {
          kode: "TIP32142",
          nama: "Keselamatan dan Kesehatan Kerja",
          sks: 2,
        },
        {
          kode: "TIP12106",
          nama: "Pendidikan Kewarganegaraan",
          sks: 2,
        },
        {
          kode: "TIP32143",
          nama: "Ekonomi Teknik",
          sks: 3,
        },
        {
          kode: "TIP32144",
          nama: "Riset Operaional dan Teknik Optimasi",
          sks: 3,
        },
        {
          kode: "TIP42104",
          nama: "Teknologi Pengolahan",
          sks: 2,
        },
        {
          kode: "TIP42105",
          nama: "Praktikum Teknologi Pengolahan",
          sks: 1,
        },
        {
          kode: "TIP42106",
          nama: "Rekayasa Genetika",
          sks: 2,
        },
        {
          kode: "TIP42115",
          nama: "Teknik Enzim",
          sks: 2,
        },
        {
          kode: "TIP42116",
          nama: "Teknik Biodegradasi",
          sks: 2,
        },
        {
          kode: "TIP42117",
          nama: "Pemisahan Produk Bioteknologi",
          sks: 2,
        },
        {
          kode: "TIP42111",
          nama: "Teknologi Pengol. Lemak dan Minyak",
          sks: 2,
        },
        {
          kode: "TIP42113",
          nama: "Teknologi Pengolahan Teh",
          sks: 2,
        },
        {
          kode: "TIP32145",
          nama: "Analisis Sistem",
          sks: 3,
        },
        {
          kode: "TIP32146",
          nama: "Manajemen Rantai Pasok",
          sks: 2,
        },
        {
          kode: "TIP32147",
          nama: "Perencanaan Proyek Industri",
          sks: 3,
        },
        {
          kode: "TIP32148",
          nama: "Teknik Tata Cara Kerja",
          sks: 2,
        },
        {
          kode: "TIP32149",
          nama: "Perancangan Pabrik",
          sks: 4,
        },
        {
          kode: "TIP42108",
          nama: "Pengemasan Penyimpanan & Penggudangan",
          sks: 2,
        },
        {
          kode: "TIP42109",
          nama: "Bioreaktor",
          sks: 2,
        },
        {
          kode: "TIP42119",
          nama: "Teknologi Pengolahan Susu",
          sks: 2,
        },
        {
          kode: "TIP42120",
          nama: "Teknologi Pengolahan Buah dan Sayur",
          sks: 2,
        },
        {
          kode: "TIP42121",
          nama: "Teknologi Pengolahan Kopi",
          sks: 2,
        },
        {
          kode: "TIP42122",
          nama: "Teknologi Pengolahan Hasil Perairan",
          sks: 2,
        },
        {
          kode: "TIP42121",
          nama: "Bioteknologi Pangan",
          sks: 2,
        },
        {
          kode: "TIP42124",
          nama: "Kultur Jaringan",
          sks: 2,
        },
        {
          kode: "TIP22101",
          nama: "KKN Tematik",
          sks: 2,
        },
        {
          kode: "TIP42110",
          nama: "Kerja Praktek",
          sks: 3,
        },
      ],
    },
    {
      Nama: "Manajemen",
      mata_kuliah: [
        {
          kode: "MN32101",
          nama: "Pengantar Manajemen Bisnis",
          sks: 2,
        },
        {
          kode: "MN32102",
          nama: "Pengantar Akutansi",
          sks: 3,
        },
        {
          kode: "MN32103",
          nama: "Matematika Bisnis I",
          sks: 3,
        },
        {
          kode: "MN32104",
          nama: "Psikologi dan Perilaku Organisasi",
          sks: 2,
        },
        {
          kode: "MN32105",
          nama: "Pengantar Ekonomi Mikro",
          sks: 2,
        },
        {
          kode: "MN12101",
          nama: "Agama Islam",
          sks: 2,
        },
        {
          kode: "MN12102",
          nama: "Agama Katolik",
          sks: 2,
        },
        {
          kode: "MN12103",
          nama: "Agama Protestan",
          sks: 2,
        },
        {
          kode: "MN12104",
          nama: "Agama Hindu",
          sks: 2,
        },
        {
          kode: "MN12104",
          nama: "Agama Budha",
          sks: 2,
        },
        {
          kode: "MN12112",
          nama: "Bahasa Inggris",
          sks: 2,
        },
        {
          kode: "MN12105",
          nama: "Pendidikan Pancasila",
          sks: 2,
        },
        {
          kode: "MN12109",
          nama: "Transformasi Digital",
          sks: 2,
        },
        {
          kode: "MN32106",
          nama: "Pengantar Ekonomi Makro",
          sks: 2,
        },
        {
          kode: "MN32107",
          nama: "Bahasa Inggris Bisnis",
          sks: 3,
        },
        {
          kode: "MN32108",
          nama: "Manajemen Resiko",
          sks: 2,
        },
        {
          kode: "MN32109",
          nama: "Aplikasi Komputer",
          sks: 3,
        },
        {
          kode: "MN32110",
          nama: "Komunikasi Bisnis",
          sks: 2,
        },
        {
          kode: "MN32111",
          nama: "Akuntansi  Biaya",
          sks: 3,
        },
        {
          kode: "MN32112",
          nama: "Matematika Bisnis II",
          sks: 3,
        },
        {
          kode: "MN12106",
          nama: "Pendidikan dan Kewarganegaraan.",
          sks: 2,
        },
        {
          kode: "MN32113",
          nama: "Hukum dan Etika Bisnis",
          sks: 2,
        },
        {
          kode: "MN32114",
          nama: "Manajemen Pemasaran",
          sks: 3,
        },
        {
          kode: "MN32115",
          nama: "Budgeting",
          sks: 3,
        },
        {
          kode: "MN32116",
          nama: "Manajemen Sumber Daya Manusia",
          sks: 3,
        },
        {
          kode: "MN32117",
          nama: "Manajemen Operasi dan Teknologi",
          sks: 3,
        },
        {
          kode: "MN32118",
          nama: "Manajemen Keuangan",
          sks: 3,
        },
        {
          kode: "MN32119",
          nama: "Statistik Bisnis",
          sks: 3,
        },
        {
          kode: "MN32120",
          nama: "Ekonomi Manajerial",
          sks: 3,
        },
        {
          kode: "MN12110",
          nama: "Dasar-Dasar Kewirausahaan",
          sks: 2,
        },
        {
          kode: "MN32122",
          nama: "Manajemen Investasi",
          sks: 3,
        },
        {
          kode: "MN32123",
          nama: "Riset Operasi - Operasional Riset",
          sks: 3,
        },
        {
          kode: "MN32124",
          nama: "Manajemen Perubahan dan Kepemimpinan",
          sks: 3,
        },
        {
          kode: "MN32125",
          nama: "Strategi  Pemasaran",
          sks: 3,
        },
        {
          kode: "MN32126",
          nama: "Teknologi Finansial",
          sks: 3,
        },
        {
          kode: "MN12107",
          nama: "Bahasa Indonesia",
          sks: 2,
        },
        {
          kode: "MN32127",
          nama: "Sistem Informasi Bisnis",
          sks: 3,
        },
        {
          kode: "MN32128",
          nama: "Riset Pasar & Perilaku Konsumen",
          sks: 3,
        },
        {
          kode: "MN32129",
          nama: "Perdagangan dan Bisnis Internasional",
          sks: 2,
        },
        {
          kode: "MN32130",
          nama: "Analisis & Kelayakan Bisnis",
          sks: 3,
        },
        {
          kode: "MN32131",
          nama: "Manajemen Mutu",
          sks: 2,
        },
        {
          kode: "MN32132",
          nama: "Kewirausahaan Lanjut",
          sks: 3,
        },
        {
          kode: "MN32133",
          nama: "Manajemen Logistik",
          sks: 2,
        },
        {
          kode: "MN42101",
          nama: "Bank dan Lembaga Keuangan",
          sks: 2,
        },
        {
          kode: "MN42102",
          nama: "Manajemen Strategis",
          sks: 3,
        },
        {
          kode: "MN42103",
          nama: "Manajemen Proyek",
          sks: 3,
        },
        {
          kode: "MN42104",
          nama: "Analisis Laporan Keuangan dan Evaluasi Ekuitas",
          sks: 3,
        },
        {
          kode: "MN42105",
          nama: "Pemasaran Digital",
          sks: 3,
        },
        {
          kode: "MN42107",
          nama: "Manajemen Perpajakan",
          sks: 2,
        },
        {
          kode: "MN42108",
          nama: "Bisnis Terpadu",
          sks: 3,
        },
        {
          kode: "MN42109",
          nama: "Manajemen Rantai Pasok/supply chain management",
          sks: 2,
        },
        {
          kode: "MN42111",
          nama: "ManajemenK3",
          sks: 2,
        },
        {
          kode: "MN42113",
          nama: "Manajemen Konflik & Serikat Buruh",
          sks: 2,
        },
        {
          kode: "MN42114",
          nama: "Perdagangan Elektronik",
          sks: 2,
        },
        {
          kode: "MN42115",
          nama: "Bisnis berbasis Lingkungan",
          sks: 2,
        },
        {
          kode: "MN42116",
          nama: "Manajemen Bisnis Keluarga",
          sks: 2,
        },
        {
          kode: "MN42117",
          nama: "Pengambilan keputusan dan negosiasi",
          sks: 2,
        },
        {
          kode: "MN42118",
          nama: "Ekonomi Koperasi",
          sks: 2,
        },
        {
          kode: "MN42128",
          nama: "Keuangan Syariah",
          sks: 2,
        },
        {
          kode: "MN42119",
          nama: "Manajemen Kompensasi",
          sks: 2,
        },
        {
          kode: "MN42106",
          nama: "Sistem Managemen Lingkungan",
          sks: 2,
        },
        {
          kode: "MN42120",
          nama: "Manajemen Portofolio",
          sks: 2,
        },
        {
          kode: "MN42121",
          nama: "Pasar modal",
          sks: 2,
        },
        {
          kode: "MN42122",
          nama: "Akuntasi Lanjut",
          sks: 2,
        },
        {
          kode: "MN42123",
          nama: "Audit keuangan dan Pengendalian",
          sks: 2,
        },
        {
          kode: "MN42124",
          nama: "Manajemen Jasa dan Pariwisata",
          sks: 2,
        },
        {
          kode: "MN42125",
          nama: "Manajemen Modal Insani",
          sks: 2,
        },
        {
          kode: "MN42126",
          nama: "Teknologi Informasi  untuk Bisnis",
          sks: 2,
        },
        {
          kode: "MN42127",
          nama: "Manajemen Keuangan Internasional",
          sks: 2,
        },
      ],
    },
  ];
  for (const pmk of prodiMataKuliah) {
    const programStudi = await prisma.programStudi.findFirst({
      where: { Nama: pmk.Nama },
    });

    if (!programStudi) {
      console.error(`Program studi '${pmk.Nama}' tidak ditemukan.`);
      continue;
    }

    if (pmk.mata_kuliah.length === 0) continue;

    const mataKuliahData = pmk.mata_kuliah.map((mk) => ({
      ProgramStudiId: programStudi.ProgramStudiId,
      Kode: mk.kode,
      Nama: mk.nama,
      Sks: mk.sks,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      DeletedAt: null,
    }));

    await prisma.mataKuliah.createMany({ data: mataKuliahData });
    console.log(`Mata kuliah untuk '${pmk.Nama}' berhasil ditambahkan.`);
  }

  const userData = [
    {
      Nama: "Admin",
      Email: "admin@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "admin_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "admin",
      Username: "admin123",
      Password: "admin123"
    },
    {
      Nama: "PMB",
      Email: "pmb@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "pmb_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "pmb",
      Username: "pmb123",
      Password: "pmb123"
    },
    {
      Nama: "akademik",
      Email: "akademik@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "pmb_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "akademik",
      Username: "akademik123",
      Password: "akademik123"
    },
    {
      Nama: "kaprodi",
      Email: "kaprodi@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "pmb_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "kaprodi",
      Username: "kaprodi123",
      Password: "kaprodi123"
    },
    {
      Nama: "asesor",
      Email: "asesor@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "pmb_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "asesor",
      Username: "asesor123",
      Password: "asesor123"
    },
    {
      Nama: "mahasiswa",
      Email: "mahasiswa@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "pmb_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "mahasiswa",
      Username: "mahasiswa123",
      Password: "mahasiswa123"
    },
    {
      Nama: "rektor",
      Email: "rektor@blabla.com",
      TempatLahir: "Jakarta",
      TanggalLahir: new Date(),
      JenisKelamin: JenisKelamin.PRIA,
      PendidikanTerakhir: Jenjang.S1,
      Avatar: "pmb_pose.jpg",
      Agama: "Islam",
      Telepon: "08123456789876",
      NomorWa: "08123456789876",
      NomorHp: "08123456789876",
      Role: "rektor",
      Username: "rektor123",
      Password: "rektor123"
    },
  ];

  await userData.forEach(ud => {
    prisma.role.findFirst({
      where: {
        Name: ud.Role
      }
    }).then(res => {
      try {
        if(res !== null) {
          prisma.alamat.create({
            data: {
              DesaId: "f3e185d6-f345-43d7-a621-55853685a1c9",
              Alamat: "Jalan Apa Aja No. 123",
              KodePos: "12345"
            }
          }).then(ress => {
            try{
              if(ress !== null) {
                prisma.user.create({
                  data: {
                    AlamatId: ress.AlamatId,
                    Nama: ud.Nama,
                    Email: ud.Email,
                    TempatLahir: ud.TempatLahir,
                    TanggalLahir: ud.TanggalLahir,
                    JenisKelamin: ud.JenisKelamin,
                    PendidikanTerakhir: ud.PendidikanTerakhir,
                    Avatar: ud.Avatar,
                    Agama: ud.Agama,
                    Telepon: ud.Telepon,
                    NomorWa: ud.NomorWa,
                    NomorHp: ud.NomorHp,
                  }
                }).then(resss => {
                  try {
                    if(resss !== null) {
                      prisma.userHasRoles.create({
                        data:{
                          RoleId: res.RoleId,
                          UserId: resss.UserId
                        }
                      }).then(req => {
                        prisma.userlogin.create({
                          data: {
                            UserId: resss.UserId,
                            Username: ud.Username,
                            Password: ud.Password,
                            Credential: "credential"
                          }
                        }).then(() => {
                          console.log("Berhasil Seed User: " + ud.Nama)
                        })
                      })
                    }
                  } catch(ex) {
                    console.error(ex)
                  }
                })
              }
            } catch(ex) {
              console.error(ex)
            }
          })
        }
      } catch(e) {
        console.error(e)
      }
    })
  })

  
}

main()
.then(() => {
    console.log("✅ Seeding selesai!");
  })
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
