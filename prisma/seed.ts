import { JenisKelamin, Jenjang, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  
  //   await prisma.statusMahasiswaAssesment.createMany({
  //       data: [
  //         {
  //           NamaStatus: "Kelengkapan Form",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M14%206l7%207l-4%204%22%20%2F%3E%20%3Cpath%20d%3D%22M5.828%2018.172a2.828%202.828%200%200%200%204%200l10.586%20-10.586a2%202%200%200%200%200%20-2.829l-1.171%20-1.171a2%202%200%200%200%20-2.829%200l-10.586%2010.586a2.828%202.828%200%200%200%200%204z%22%20%2F%3E%20%3Cpath%20d%3D%22M4%2020l1.768%20-1.768%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 1,
  //           Keterangan: "Mahasiswa Melengkapi Form Asessment",
  //         },
  //         {
  //           NamaStatus: "Penunjukan Asesor",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M5%207a4%204%200%201%200%208%200a4%204%200%200%200%20-8%200%22%20%2F%3E%20%3Cpath%20d%3D%22M3%2021v-2a4%204%200%200%201%204%20-4h4c.96%200%201.84%20.338%202.53%20.901%22%20%2F%3E%20%3Cpath%20d%3D%22M16%203.13a4%204%200%200%201%200%207.75%22%20%2F%3E%20%3Cpath%20d%3D%22M16%2019h6%22%20%2F%3E%20%3Cpath%20d%3D%22M19%2016v6%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 2,
  //           Keterangan: "2 Asesor ditunjuk Kepala Prodi untuk Asessmen 1 Mahasiswa",
  //         },
  //         {
  //           NamaStatus: "Evaluasi Mandiri",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M12%2019h-7a2%202%200%200%201%20-2%20-2v-11a2%202%200%200%201%202%20-2h4l3%203h7a2%202%200%200%201%202%202v3.5%22%20%2F%3E%20%3Cpath%20d%3D%22M19%2016v6%22%20%2F%3E%20%3Cpath%20d%3D%22M22%2019l-3%203l-3%20-3%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 3,
  //           Keterangan: "Mahasiswa Melengkapi Evaluasi Mandiri",
  //         },
  //         {
  //           NamaStatus: "Hasil Asessmen",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M10%2019h-6a1%201%200%200%201%20-1%20-1v-14a1%201%200%200%201%201%20-1h6a2%202%200%200%201%202%202a2%202%200%200%201%202%20-2h6a1%201%200%200%201%201%201v14a1%201%200%200%201%20-1%201h-6a2%202%200%200%200%20-2%202a2%202%200%200%200%20-2%20-2z%22%20%2F%3E%20%3Cpath%20d%3D%22M12%205v16%22%20%2F%3E%20%3Cpath%20d%3D%22M7%207h1%22%20%2F%3E%20%3Cpath%20d%3D%22M7%2011h1%22%20%2F%3E%20%3Cpath%20d%3D%22M16%207h1%22%20%2F%3E%20%3Cpath%20d%3D%22M16%2011h1%22%20%2F%3E%20%3Cpath%20d%3D%22M16%2015h1%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 4,
  //           Keterangan: "Hasil Asessmen Sudah Selesai",
  //         },
  //         {
  //           NamaStatus: "Sanggahan",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M7%203h10a2%202%200%200%201%202%202v10m0%204a2%202%200%200%201%20-2%202h-10a2%202%200%200%201%20-2%20-2v-14%22%20%2F%3E%20%3Cpath%20d%3D%22M11%207h4%22%20%2F%3E%20%3Cpath%20d%3D%22M9%2011h2%22%20%2F%3E%20%3Cpath%20d%3D%22M9%2015h4%22%20%2F%3E%20%3Cpath%20d%3D%22M3%203l18%2018%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 5,
  //           Keterangan: "Mahasiswa Menyanggah Hasil Asessmen",
  //         },
  //         {
  //           NamaStatus: "Rekapitulasi Hasil",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M15%208h.01%22%20%2F%3E%20%3Cpath%20d%3D%22M11.5%2021h-5.5a3%203%200%200%201%20-3%20-3v-12a3%203%200%200%201%203%20-3h12a3%203%200%200%201%203%203v7%22%20%2F%3E%20%3Cpath%20d%3D%22M3%2016l5%20-5c.928%20-.893%202.072%20-.893%203%200l4%204%22%20%2F%3E%20%3Cpath%20d%3D%22M14%2014l1%20-1c.928%20-.893%202.072%20-.893%203%200l.5%20.5%22%20%2F%3E%20%3Cpath%20d%3D%22M15%2019l2%202l4%20-4%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 6,
  //           Keterangan: "Akademik Menyiapkan Sk. Rektor",
  //         },
  //         {
  //           NamaStatus: "SK. Rektor",
  //           Icon: `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M15%2015m-3%200a3%203%200%201%200%206%200a3%203%200%201%200%20-6%200%22%20%2F%3E%20%3Cpath%20d%3D%22M13%2017.5v4.5l2%20-1.5l2%201.5v-4.5%22%20%2F%3E%20%3Cpath%20d%3D%22M10%2019h-5a2%202%200%200%201%20-2%20-2v-10c0%20-1.1%20.9%20-2%202%20-2h14a2%202%200%200%201%202%202v10a2%202%200%200%201%20-1%201.73%22%20%2F%3E%20%3Cpath%20d%3D%22M6%209l12%200%22%20%2F%3E%20%3Cpath%20d%3D%22M6%2012l3%200%22%20%2F%3E%20%3Cpath%20d%3D%22M6%2015l2%200%22%20%2F%3E%20%3C%2Fsvg%3E%20`,
  //           Urutan: 7,
  //           Keterangan: "Akademik Unggah Dokumen Sk. Rektor",
  //         },
  //       ],
  //   });

  // await prisma.role.createMany({
  //   data: [
  //     {
  //       Name: "admin",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //     {
  //       Name: "pmb",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //     {
  //       Name: "akademik",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //     {
  //       Name: "kaprodi",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //     {
  //       Name: "asesor",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //     {
  //       Name: "mahasiswa",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //     {
  //       Name: "rektor",
  //       GuardName: "web",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date()
  //     },
  //   ],
  // });

  // await prisma.permission.createMany({
  //   data: [
  //     {
  //       Name: "user.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "user.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "user.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "user.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "role.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "role.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "role.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "role.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "role.assign",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "permission.assign",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "permission.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "permission.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "permission.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "permission.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.notify",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.upload",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "mahasiswa.import",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "form.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "form.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "form.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "form.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "eval.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "eval.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "eval.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "eval.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesor.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesor.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesor.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesor.assign",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesor.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesor.notify",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesmen.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesmen.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesmen.delete",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesmen.lock",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "asesmen.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "sanggahan.create",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "sanggahan.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "sanggahan.update",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "sanggahan.respond",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "rekapitulasi.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "rekapitulasi.generate",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "rekapitulasi.sign",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "rekapitulasi.distribute",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //     {
  //       Name: "dashboard.view",
  //       GuardName: "web",
  //       CreatedAt: new Date,
  //       UpdatedAt: new Date
  //     },
  //   ],
  // });

  // const role = await prisma.role.findMany();

  // const relationRolePermission = [
  //   {
  //     role: "admin",
  //     permission: ["all"],
  //   },
  //   {
  //     role: "pmb",
  //     permission: [
  //       "mahasiswa.create",
  //       "mahasiswa.update",
  //       "mahasiswa.view",
  //       "mahasiswa.delete",
  //       "mahasiswa.notify",
  //       "mahasiswa.upload",
  //       "mahasiswa.import",
  //     ],
  //   },
  //   {
  //     role: "akademik",
  //     permission: [
  //       "asesmen.lock",
  //       "rekapitulasi.view",
  //       "rekapitulasi.generate",
  //       "rekapitulasi.sign",
  //       "rekapitulasi.distribute",
  //     ],
  //   },
  //   {
  //     role: "kaprodi",
  //     permission: [
  //       "asesor.create",
  //       "asesor.update",
  //       "asesor.delete",
  //       "asesor.assign",
  //       "asesor.view",
  //       "asesor.notify",
  //     ],
  //   },
  //   {
  //     role: "asesor",
  //     permission: [
  //       "sanggahan.view",
  //       "sanggahan.respond",
  //       "asesmen.create",
  //       "asesmen.update",
  //       "asesmen.delete",
  //       "asesmen.view",
  //     ],
  //   },
  //   {
  //     role: "mahasiswa",
  //     permission: [
  //       "form.create",
  //       "form.update",
  //       "form.view",
  //       "form.delete",
  //       "eval.create",
  //       "eval.update",
  //       "eval.view",
  //       "eval.delete",
  //       "sanggahan.create",
  //       "sanggahan.update",
  //       "sanggahan.view",
  //     ],
  //   },
  //   {
  //     role: "rektor",
  //     permission: ["dashboard.view"],
  //   },
  // ];

  // for (const r of role) {
  //   const matchedRole = relationRolePermission.find(
  //     (rel) => rel.role === r.Name
  //   );
  //   if (!matchedRole) continue;

  //   let permissionsToAssign = [];

  //   if (matchedRole.permission[0] === "all") {
  //     permissionsToAssign = await prisma.permission.findMany();
  //   } else {
  //     permissionsToAssign = await prisma.permission.findMany({
  //       where: {
  //         Name: {
  //           in: matchedRole.permission,
  //         },
  //       },
  //     });
  //   }

  //   for (const per of permissionsToAssign) {
  //     await prisma.roleHasPermissions.create({
  //       data: {
  //         RoleId: r.RoleId,
  //         PermissionId: per.PermissionId,
  //       },
  //     });
  //   }
  // }

  // let temp = await prisma.alamat.create({
  //   data: {
  //     DesaId: "d1856e8b-29d3-4cd2-b026-01ca59e9dd21",
  //     Alamat:
  //       "Jl. Puspitek, Setu, Kec. Serpong, Kota Tangerang Selatan, Banten",
  //     KodePos: "15314",
  //   },
  // });

  // const university = await prisma.university.create({
  //   data: {
  //     Nama: "Institut Teknologi Indonesia",
  //     Akreditasi: "A",
  //     CreatedAt: new Date(),
  //     UpdatedAt: new Date(),
  //     DeletedAt: null,
  //     AlamatId: temp.AlamatId,
  //   },
  // });

  // await prisma.programStudi.createMany({
  //   data: [
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknik Informatika",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknik Elektro",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknik Mesin",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknik Industri",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknik Kimia",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknik Sipil",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Arsitektur",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Perencanaan Wilayah dan Kota",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Teknologi Industri Pertanian",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //     {
  //       UniversityId: university.UniversityId,
  //       Nama: "Manajemen",
  //       Jenjang: Jenjang.S1,
  //       Akreditasi: "A",
  //       CreatedAt: new Date(),
  //       UpdatedAt: new Date(),
  //     },
  //   ],
  // });

  // const prodiMataKuliah = [
  //   {
  //     Nama: "Teknik Informatika",
  //     mata_kuliah: [
  //       {
  //         kode: "IF 12101",
  //         nama: "Agama Islam",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12102",
  //         nama: "Agama Kristen Protestan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12103",
  //         nama: "Agama Kristen Katholik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12104",
  //         nama: "Agama Buddha/Hindu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12108",
  //         nama: "Matematika 1",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 12112",
  //         nama: "Bahasa Inggris",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12109",
  //         nama: "Transformasi Digital ",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32101",
  //         nama: "Pemrograman Dasar",
  //         sks: 4,
  //       },
  //       {
  //         kode: "IF 32102",
  //         nama: "Dasar Sistem Digital",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32103",
  //         nama: "Statistika 1",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32104",
  //         nama: "Struktur Data",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32105",
  //         nama: "Matematika 2",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32106",
  //         nama: "Interaksi Manusia dan Komputer",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32103",
  //         nama: "Matematika Diskrit",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32107",
  //         nama: "Pemrograman Berorientasi Objek",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32108",
  //         nama: "Dasar Arsitektur dan Organisasi Komputer",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32109",
  //         nama: "Statistika 2",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12107",
  //         nama: "Bahasa Indonesia",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32110",
  //         nama: "Aljabar Linier",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32146",
  //         nama: "Analisis dan Perancangan Sistem",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32112",
  //         nama: "Pemrograman Visual",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32113",
  //         nama: "Database 1",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32115",
  //         nama: "Sistem Operasi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 12106",
  //         nama: "Kewarganegaraan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12110",
  //         nama: "Dasar Kewirausahaan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32125",
  //         nama: "Pemrograman Berbasis Web",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32117",
  //         nama: "Rekayasa Perangkat Lunak",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32119",
  //         nama: "Database 2",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32120",
  //         nama: "Jaringan Komputer",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32111",
  //         nama: "Perancangan dan Analisa Algoritma",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32114",
  //         nama: "Kecerdasan Buatan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 12111",
  //         nama: "Kewirausahaan Lanjut",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32118",
  //         nama: "Machine Learning",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32122",
  //         nama: "Teknologi Multimedia",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32123",
  //         nama: "Kecakapan Antar Personal",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32124",
  //         nama: "Sistem Informasi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32116",
  //         nama: "Teknik Riset Operasional",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32126",
  //         nama: "Mobile Cloud Computing",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32127",
  //         nama: "Pemrograman Aplikasi Mobile",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32128",
  //         nama: "Jaringan Komputer Lanjut",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32129",
  //         nama: "Keamanan Informasi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32130",
  //         nama: "Sistem Paralel dan Terdistribusi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32131",
  //         nama: "Pemodelan dan Simulasi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32121",
  //         nama: "Grafika Komputer",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 42101",
  //         nama: "Kerja Praktek",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32132",
  //         nama: "Data Visualization",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42125",
  //         nama: "IT Project",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32133",
  //         nama: "Natural Language Processing / Pemrosesan Bahasa Natural",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 32134",
  //         nama: "Data Mining",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32135",
  //         nama: "Etika Profesi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42104",
  //         nama: "Pegembangan Aplikasi Enterprise",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42107",
  //         nama: "Pengolahan Citra",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42108",
  //         nama: "eCommerce",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42110",
  //         nama: "Penjaminan Mutu Perangkat Lunak",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 32111",
  //         nama: "Pemrograman Game",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 42112",
  //         nama: "Pemrograman Semantik Web",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42113",
  //         nama: "Big Data Analytic",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42115",
  //         nama: "Digital Forensic",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42116",
  //         nama: "Kriptografi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "IF 42119",
  //         nama: "Pengembangan Microservices",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42120",
  //         nama: "Internet of Things",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42121",
  //         nama: "Administrasi Sistem",
  //         sks: 2,
  //       },
  //       {
  //         kode: "IF 42123",
  //         nama: "Network Security",
  //         sks: 2,
  //       },
  //     ],
  //   },
  //   {
  //     Nama: "Teknik Elektro",
  //     mata_kuliah: [],
  //   },
  //   {
  //     Nama: "Teknik Mesin",
  //     mata_kuliah: [
  //       {
  //         kode: "MS 32101",
  //         nama: "Fisika Dasar I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12108",
  //         nama: "Matematika I",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32102",
  //         nama: "Kimia Dasar",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32103",
  //         nama: "Menggambar Teknik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12101",
  //         nama: "Agama Islam",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12102",
  //         nama: "Agama Kristen Protestan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12103",
  //         nama: "Agama Kristen Katholik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12104",
  //         nama: "Agama Buddha",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12104",
  //         nama: "Agama Hindu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12105",
  //         nama: "Pancasila",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12107",
  //         nama: "Bahasa Indonesia",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12112",
  //         nama: "Bahasa Inggris",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12109",
  //         nama: "Transformasi Digital",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32104",
  //         nama: "Praktikum Kimia Dasar",
  //         sks: 1,
  //       },
  //       {
  //         kode: "MS 32105",
  //         nama: "Fisika Dasar II",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32106",
  //         nama: "Matematika II",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32107",
  //         nama: "Menggambar Mesin Berbasis Komputer",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32108",
  //         nama: "Praktikum Fisika Dasar",
  //         sks: 1,
  //       },
  //       {
  //         kode: "MS 32109",
  //         nama: "Statika Struktur",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32110",
  //         nama: "Material Teknik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32111",
  //         nama: "Keselamatan Kesehatan Kerja dan Lingkungan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 12106",
  //         nama: "Kewarganegaraan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32127",
  //         nama: "Statistik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32113",
  //         nama: "Metalurgi Fisik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32114",
  //         nama: "Teknik Tenaga Listrik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32115",
  //         nama: "Kinematika",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32116",
  //         nama: "Mekanika Kekuatan Material",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32117",
  //         nama: "Mekanika Fluida I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32118",
  //         nama: "Termodinamika Dasar",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32119",
  //         nama: "Otomatisasi dan Sistem Servo",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32121",
  //         nama: "Simulasi Numerik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32120",
  //         nama: "Prak, Rekayasa Material",
  //         sks: 1,
  //       },
  //       {
  //         kode: "MS 12110",
  //         nama: "Dasar Kewirausahaan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32122",
  //         nama: "Mekanika Fluida II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32123",
  //         nama: "Mekatronika",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32124",
  //         nama: "Elemen Mesin I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32125",
  //         nama: "Dinamika Teknik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32126",
  //         nama: "Termodinamika Teknik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32112",
  //         nama: "Matematika Teknik I",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32128",
  //         nama: "Perpindahan Panas",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 32129",
  //         nama: "Elemen Mesin II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 32130",
  //         nama: "Pengukuran Teknik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42101",
  //         nama: "Matematika Teknik II",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42102",
  //         nama: "Motor Bakar Torak",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42103",
  //         nama: "Prakt. Fenomena Dasar Mesin",
  //         sks: 1,
  //       },
  //       {
  //         kode: "MS 12111",
  //         nama: "Kewirausahaan Lanjut",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42104",
  //         nama: "Proses Produksi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42105",
  //         nama: "Prakt. Proses Produksi",
  //         sks: 1,
  //       },
  //       {
  //         kode: "MS 42105",
  //         nama: "Mesin Konversi Energi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42107",
  //         nama: "Elemen Mesin III",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42109",
  //         nama: "Praktikum Prestasi Mesin",
  //         sks: 1,
  //       },
  //       {
  //         kode: "MS 42110",
  //         nama: "Perawatan Mesin",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42111",
  //         nama: "Getaran Mekanis",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42112",
  //         nama: "Teknik Pengaturan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42113",
  //         nama: "Kerja Praktek + Seminar",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42114",
  //         nama: "Meterologi Industri & Statistik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42115",
  //         nama: "Konstruksi Mesin",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 42117",
  //         nama: "Teknologi Pembentukan",
  //         sks: 3,
  //       },
  //       {
  //         kode: "3211312",
  //         nama: "Aerodinamika Pesawat Terbang I",
  //         sks: 3,
  //       },
  //       {
  //         kode: "5411225",
  //         nama: "Performa Pesawat Terbang",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MS 322101",
  //         nama: "Kuliah Kerja Nyata",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42129",
  //         nama: "Alat Pengangkat",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42130",
  //         nama: "Pneumatik & Hidraulik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42131",
  //         nama: "Elemen Hingga",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42132",
  //         nama: "Fatigue",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42133",
  //         nama: "Otomasi dan Robotika",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42134",
  //         nama: "Kebisingan dan Getaran",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42141",
  //         nama: "Teknik Pendingin",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42142",
  //         nama: "Ketel Uap",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42143",
  //         nama: "Turbin Gas",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42144",
  //         nama: "Pompa Dan Kompresor",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42145",
  //         nama: "Dinamika Gas",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42146",
  //         nama: "Teknik Pembakaran",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42135",
  //         nama: "Teknologi Pengelasan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42136",
  //         nama: "CNC",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42137",
  //         nama: "Sistem Produksi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42138",
  //         nama: "Non-Destructive Inspection",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42139",
  //         nama: "Penilaian Kinerja Manufaktur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MS 42140",
  //         nama: "Korosi dan Pencegahannya",
  //         sks: 2,
  //       },
  //     ],
  //   },
  //   {
  //     Nama: "Teknik Industri",
  //     mata_kuliah: [],
  //   },
  //   {
  //     Nama: "Teknik Kimia",
  //     mata_kuliah: [],
  //   },
  //   {
  //     Nama: "Teknik Sipil",
  //     mata_kuliah: [],
  //   },
  //   {
  //     Nama: "Arsitektur",
  //     mata_kuliah: [
  //       {
  //         kode: "AR 12101",
  //         nama: "Agama Islam",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12102",
  //         nama: "Agama Protestan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12103",
  //         nama: "Agama Katholik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12104",
  //         nama: "Agama Hindu/ Buddha/ Konghucu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12108",
  //         nama: "Matematika",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32101",
  //         nama: "Mekanika Teknik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 32102",
  //         nama: "Pengantar Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32103",
  //         nama: "Pengenalan Bahan ",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32104",
  //         nama: "Studio Arsitektur I",
  //         sks: 4,
  //       },
  //       {
  //         kode: "AR 12109",
  //         nama: "Transformasi Digital",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32105",
  //         nama: "Teknologi Bangunan Sederhana",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32106",
  //         nama: "Arsitektur dan Lingkungan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12112",
  //         nama: "Bahasa Inggris",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32107",
  //         nama: "Metoda Perancangan I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32108",
  //         nama: "Praktikum Teknologi Bangunan Tropis I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32109",
  //         nama: "Studio Arsitektur II",
  //         sks: 4,
  //       },
  //       {
  //         kode: "AR 32110",
  //         nama: "Teknologi Bahan ",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32111",
  //         nama: "Teknologi Bangunan Tropis I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32112",
  //         nama: "Teori Arsitektur",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 12107",
  //         nama: "Bahasa Indonesia",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32113",
  //         nama: "Komputer dalam Arsitektur",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 12105",
  //         nama: "Pancasila",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32114",
  //         nama: "Perancangan Tapak",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32115",
  //         nama: "Praktikum Teknologi Bangunan Tropis II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32117",
  //         nama: "Sejarah Arsitektur I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32118",
  //         nama: "Studio Perancangan Arsitektur I",
  //         sks: 6,
  //       },
  //       {
  //         kode: "AR 32119",
  //         nama: "Teknologi Bangunan Tropis II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12110",
  //         nama: "Dasar Kewirausahaan ",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12106",
  //         nama: "Kewarganegaraan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32121",
  //         nama: "Metoda Perancangan II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32122",
  //         nama: "Sejarah Arsitektur II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32123",
  //         nama: "Sistem Kelengkapan Bangunan",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 32124",
  //         nama: "Studio Perancangan Arsitektur II",
  //         sks: 6,
  //       },
  //       {
  //         kode: "AR 32125",
  //         nama: "Teknologi Bangunan Rendah",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32126",
  //         nama: "Perencanaan dan Perancangan Kota",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 12111",
  //         nama: "Kewirausahaan Lanjut",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 32127",
  //         nama: "Metoda Penelitian Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32128",
  //         nama: "Perumahan dan Pembangunan Perkotaan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32116",
  //         nama: "Pranata Pembangunan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32129",
  //         nama: "Studio Perancangan Arsitektur III",
  //         sks: 6,
  //       },
  //       {
  //         kode: "AR 32130",
  //         nama: "Teknologi Bangunan Bentang Lebar",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32131",
  //         nama: "Teori Kritik Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42101",
  //         nama: "Kerja Praktik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 32120",
  //         nama: "Komunikasi Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42102",
  //         nama: "Perilaku Berprofesi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 32132",
  //         nama: "Studio Perancangan Arsitektur IV",
  //         sks: 6,
  //       },
  //       {
  //         kode: "AR 32133",
  //         nama: "Teknologi Bangunan Tinggi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42105",
  //         nama: "Arsitektur Bentang Alam",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42106",
  //         nama: "Arsitektur Hijau",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42107",
  //         nama: "Desain Industrial",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42108",
  //         nama: "Digitalisasi Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42109",
  //         nama: "Manajemen Proyek/ Pembangunan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42111",
  //         nama: "Revitalisasi Kawasan Perkotaan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42103",
  //         nama: "Arsitektur Interior",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42104",
  //         nama: "Kota terpadu dan Berkelanjutan",
  //         sks: 3,
  //       },
  //       {
  //         kode: "AR 42112",
  //         nama: "Arsitektur Intelijen",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42113",
  //         nama: "Arsitektur Vernakular",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42114",
  //         nama: "Konservasi Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42115",
  //         nama: "Perencanaan Dan Perancangan Perumahan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42116",
  //         nama: "Perilaku Arsitektur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "AR 42117",
  //         nama: "Tipologi dan Morfologi Bangunan",
  //         sks: 2,
  //       },
  //     ],
  //   },
  //   {
  //     Nama: "Perencanaan Wilayah dan Kota",
  //     mata_kuliah: [],
  //   },
  //   {
  //     Nama: "Teknologi Industri Pertanian",
  //     mata_kuliah: [
  //       {
  //         kode: "TIP12101",
  //         nama: "Pendidikan Agama Islam",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12102",
  //         nama: "Pendidikan Agama Kristen Protestan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12103",
  //         nama: "Pendidikan Agama Kristen Katolik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12104",
  //         nama: "Pendidikan Agama Hindu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12104",
  //         nama: "Pendidikan Agama Budha",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12107",
  //         nama: "Bahasa Indonesia",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12109",
  //         nama: "Transformasi Digital",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32101",
  //         nama: "Biologi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32102",
  //         nama: "Praktikum Biologi",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32103",
  //         nama: "Fisika Dasar I",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32104",
  //         nama: "Praktikum Fisika Dasar I",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32105",
  //         nama: "Kimia Dasar",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32106",
  //         nama: "Praktikum Kimia Dasar",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP12108",
  //         nama: "Matematika I",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32107",
  //         nama: "Pengantar Agroindustri",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32108",
  //         nama: "Pengantar Bioteknologi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32109",
  //         nama: "Manajemen SDM",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32110",
  //         nama: "Fisika Dasar II",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32111",
  //         nama: "Menggambar Teknik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32112",
  //         nama: "Matematika Industri",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32113",
  //         nama: "Pengetahuan Lingkungan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32114",
  //         nama: "Kimia Organik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32115",
  //         nama: "Praktikum Kimia Organik",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32116",
  //         nama: "Biokimia",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32117",
  //         nama: "	Praktikum Biokimia",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP12112",
  //         nama: "Bahasa Inggris",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32118",
  //         nama: "Mesin dan Instrumentasi Industri",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32119",
  //         nama: "Biologi Sel Molekuler",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32120",
  //         nama: "Penerapan Komputer",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32121",
  //         nama: "Praktikum Penerapan Komputer",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP12105",
  //         nama: "Pancasila",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32122",
  //         nama: "Pengetahuan Bahan Agroindustri",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32123",
  //         nama: "Dasar Teknik Rekayasa Proses",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32124",
  //         nama: "Praktikum Dasar Teknik Rekayasa Proses",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32125",
  //         nama: "Ekonomi Industri",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32126",
  //         nama: "Statistika Industri",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32127",
  //         nama: "Tata Letak dan Penanganan Bahan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32128",
  //         nama: "Kimia Industri",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32129",
  //         nama: "Satuan Proses",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12110",
  //         nama: "Dasar Kewirausahaan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32130",
  //         nama: "Sosiologi Industri",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32131",
  //         nama: "Praktikum Satuan Proses",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32132",
  //         nama: "Regulasi Pangan dan Bioteknologi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42101",
  //         nama: "Ilmu Gizi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42102",
  //         nama: "Genetika",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42103",
  //         nama: "Praktikum Genetika",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP12111",
  //         nama: "Kewirausahaan Lanjut",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32133",
  //         nama: "Analisis Bahan Hasil Pertanian",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32134",
  //         nama: "Praktikum Analisis Bahan Hasil Pertanian",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32135",
  //         nama: "Mikrobiologi Industri",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32136",
  //         nama: "Praktikum Mikrobiologi Industri",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP32137",
  //         nama: "Satuan Operasi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32138",
  //         nama: "Pengawasan Mutu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32139",
  //         nama: "Metode Ilmiah",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32140",
  //         nama: "Pengujian Sensoris",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32141",
  //         nama: "Manajemen Lingkungan",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32142",
  //         nama: "Keselamatan dan Kesehatan Kerja",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP12106",
  //         nama: "Pendidikan Kewarganegaraan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32143",
  //         nama: "Ekonomi Teknik",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32144",
  //         nama: "Riset Operaional dan Teknik Optimasi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP42104",
  //         nama: "Teknologi Pengolahan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42105",
  //         nama: "Praktikum Teknologi Pengolahan",
  //         sks: 1,
  //       },
  //       {
  //         kode: "TIP42106",
  //         nama: "Rekayasa Genetika",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42115",
  //         nama: "Teknik Enzim",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42116",
  //         nama: "Teknik Biodegradasi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42117",
  //         nama: "Pemisahan Produk Bioteknologi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42111",
  //         nama: "Teknologi Pengol. Lemak dan Minyak",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42113",
  //         nama: "Teknologi Pengolahan Teh",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32145",
  //         nama: "Analisis Sistem",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32146",
  //         nama: "Manajemen Rantai Pasok",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32147",
  //         nama: "Perencanaan Proyek Industri",
  //         sks: 3,
  //       },
  //       {
  //         kode: "TIP32148",
  //         nama: "Teknik Tata Cara Kerja",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP32149",
  //         nama: "Perancangan Pabrik",
  //         sks: 4,
  //       },
  //       {
  //         kode: "TIP42108",
  //         nama: "Pengemasan Penyimpanan & Penggudangan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42109",
  //         nama: "Bioreaktor",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42119",
  //         nama: "Teknologi Pengolahan Susu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42120",
  //         nama: "Teknologi Pengolahan Buah dan Sayur",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42121",
  //         nama: "Teknologi Pengolahan Kopi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42122",
  //         nama: "Teknologi Pengolahan Hasil Perairan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42121",
  //         nama: "Bioteknologi Pangan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42124",
  //         nama: "Kultur Jaringan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP22101",
  //         nama: "KKN Tematik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "TIP42110",
  //         nama: "Kerja Praktek",
  //         sks: 3,
  //       },
  //     ],
  //   },
  //   {
  //     Nama: "Manajemen",
  //     mata_kuliah: [
  //       {
  //         kode: "MN32101",
  //         nama: "Pengantar Manajemen Bisnis",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32102",
  //         nama: "Pengantar Akutansi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32103",
  //         nama: "Matematika Bisnis I",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32104",
  //         nama: "Psikologi dan Perilaku Organisasi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32105",
  //         nama: "Pengantar Ekonomi Mikro",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12101",
  //         nama: "Agama Islam",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12102",
  //         nama: "Agama Katolik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12103",
  //         nama: "Agama Protestan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12104",
  //         nama: "Agama Hindu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12104",
  //         nama: "Agama Budha",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12112",
  //         nama: "Bahasa Inggris",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12105",
  //         nama: "Pendidikan Pancasila",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN12109",
  //         nama: "Transformasi Digital",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32106",
  //         nama: "Pengantar Ekonomi Makro",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32107",
  //         nama: "Bahasa Inggris Bisnis",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32108",
  //         nama: "Manajemen Resiko",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32109",
  //         nama: "Aplikasi Komputer",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32110",
  //         nama: "Komunikasi Bisnis",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32111",
  //         nama: "Akuntansi  Biaya",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32112",
  //         nama: "Matematika Bisnis II",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN12106",
  //         nama: "Pendidikan dan Kewarganegaraan.",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32113",
  //         nama: "Hukum dan Etika Bisnis",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32114",
  //         nama: "Manajemen Pemasaran",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32115",
  //         nama: "Budgeting",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32116",
  //         nama: "Manajemen Sumber Daya Manusia",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32117",
  //         nama: "Manajemen Operasi dan Teknologi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32118",
  //         nama: "Manajemen Keuangan",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32119",
  //         nama: "Statistik Bisnis",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32120",
  //         nama: "Ekonomi Manajerial",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN12110",
  //         nama: "Dasar-Dasar Kewirausahaan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32122",
  //         nama: "Manajemen Investasi",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32123",
  //         nama: "Riset Operasi - Operasional Riset",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32124",
  //         nama: "Manajemen Perubahan dan Kepemimpinan",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32125",
  //         nama: "Strategi  Pemasaran",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32126",
  //         nama: "Teknologi Finansial",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN12107",
  //         nama: "Bahasa Indonesia",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32127",
  //         nama: "Sistem Informasi Bisnis",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32128",
  //         nama: "Riset Pasar & Perilaku Konsumen",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32129",
  //         nama: "Perdagangan dan Bisnis Internasional",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32130",
  //         nama: "Analisis & Kelayakan Bisnis",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32131",
  //         nama: "Manajemen Mutu",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN32132",
  //         nama: "Kewirausahaan Lanjut",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN32133",
  //         nama: "Manajemen Logistik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42101",
  //         nama: "Bank dan Lembaga Keuangan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42102",
  //         nama: "Manajemen Strategis",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN42103",
  //         nama: "Manajemen Proyek",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN42104",
  //         nama: "Analisis Laporan Keuangan dan Evaluasi Ekuitas",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN42105",
  //         nama: "Pemasaran Digital",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN42107",
  //         nama: "Manajemen Perpajakan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42108",
  //         nama: "Bisnis Terpadu",
  //         sks: 3,
  //       },
  //       {
  //         kode: "MN42109",
  //         nama: "Manajemen Rantai Pasok/supply chain management",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42111",
  //         nama: "ManajemenK3",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42113",
  //         nama: "Manajemen Konflik & Serikat Buruh",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42114",
  //         nama: "Perdagangan Elektronik",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42115",
  //         nama: "Bisnis berbasis Lingkungan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42116",
  //         nama: "Manajemen Bisnis Keluarga",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42117",
  //         nama: "Pengambilan keputusan dan negosiasi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42118",
  //         nama: "Ekonomi Koperasi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42128",
  //         nama: "Keuangan Syariah",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42119",
  //         nama: "Manajemen Kompensasi",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42106",
  //         nama: "Sistem Managemen Lingkungan",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42120",
  //         nama: "Manajemen Portofolio",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42121",
  //         nama: "Pasar modal",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42122",
  //         nama: "Akuntasi Lanjut",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42123",
  //         nama: "Audit keuangan dan Pengendalian",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42124",
  //         nama: "Manajemen Jasa dan Pariwisata",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42125",
  //         nama: "Manajemen Modal Insani",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42126",
  //         nama: "Teknologi Informasi  untuk Bisnis",
  //         sks: 2,
  //       },
  //       {
  //         kode: "MN42127",
  //         nama: "Manajemen Keuangan Internasional",
  //         sks: 2,
  //       },
  //     ],
  //   },
  // ];
  // for (const pmk of prodiMataKuliah) {
  //   const programStudi = await prisma.programStudi.findFirst({
  //     where: { Nama: pmk.Nama },
  //   });

  //   if (!programStudi) {
  //     console.error(`Program studi '${pmk.Nama}' tidak ditemukan.`);
  //     continue;
  //   }

  //   if (pmk.mata_kuliah.length === 0) continue;

  //   const mataKuliahData = pmk.mata_kuliah.map((mk) => ({
  //     ProgramStudiId: programStudi.ProgramStudiId,
  //     Kode: mk.kode,
  //     Nama: mk.nama,
  //     Sks: mk.sks,
  //     CreatedAt: new Date(),
  //     UpdatedAt: new Date(),
  //     DeletedAt: null,
  //   }));

  //   await prisma.mataKuliah.createMany({ data: mataKuliahData });
  //   console.log(`Mata kuliah untuk '${pmk.Nama}' berhasil ditambahkan.`);
  // }

  // const userData = [
  //   {
  //     Nama: "Admin",
  //     Email: "admin@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "admin_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "admin",
  //     Username: "admin123",
  //     Password: "admin123"
  //   },
  //   {
  //     Nama: "PMB",
  //     Email: "pmb@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "pmb_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "pmb",
  //     Username: "pmb123",
  //     Password: "pmb123"
  //   },
  //   {
  //     Nama: "akademik",
  //     Email: "akademik@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "pmb_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "akademik",
  //     Username: "akademik123",
  //     Password: "akademik123"
  //   },
  //   {
  //     Nama: "kaprodi",
  //     Email: "kaprodi@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "pmb_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "kaprodi",
  //     Username: "kaprodi123",
  //     Password: "kaprodi123"
  //   },
  //   {
  //     Nama: "asesor",
  //     Email: "asesor@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "pmb_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "asesor",
  //     Username: "asesor123",
  //     Password: "asesor123"
  //   },
  //   {
  //     Nama: "mahasiswa",
  //     Email: "mahasiswa@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "pmb_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "mahasiswa",
  //     Username: "mahasiswa123",
  //     Password: "mahasiswa123"
  //   },
  //   {
  //     Nama: "rektor",
  //     Email: "rektor@blabla.com",
  //     TempatLahir: "Jakarta",
  //     TanggalLahir: new Date(),
  //     JenisKelamin: JenisKelamin.PRIA,
  //     PendidikanTerakhir: Jenjang.S1,
  //     Avatar: "pmb_pose.jpg",
  //     Agama: "Islam",
  //     Telepon: "08123456789876",
  //     NomorWa: "08123456789876",
  //     NomorHp: "08123456789876",
  //     Role: "rektor",
  //     Username: "rektor123",
  //     Password: "rektor123"
  //   },
  // ];

  // await userData.forEach(ud => {
  //   prisma.role.findFirst({
  //     where: {
  //       Name: ud.Role
  //     }
  //   }).then(res => {
  //     try {
  //       if(res !== null) {
  //         prisma.alamat.create({
  //           data: {
  //             DesaId: "f3e185d6-f345-43d7-a621-55853685a1c9",
  //             Alamat: "Jalan Apa Aja No. 123",
  //             KodePos: "12345"
  //           }
  //         }).then(ress => {
  //           try{
  //             if(ress !== null) {
  //               prisma.user.create({
  //                 data: {
  //                   AlamatId: ress.AlamatId,
  //                   Nama: ud.Nama,
  //                   Email: ud.Email,
  //                   TempatLahir: ud.TempatLahir,
  //                   TanggalLahir: ud.TanggalLahir,
  //                   JenisKelamin: ud.JenisKelamin,
  //                   PendidikanTerakhir: ud.PendidikanTerakhir,
  //                   Avatar: ud.Avatar,
  //                   Agama: ud.Agama,
  //                   Telepon: ud.Telepon,
  //                   NomorWa: ud.NomorWa,
  //                   NomorHp: ud.NomorHp,
  //                 }
  //               }).then(resss => {
  //                 try {
  //                   if(resss !== null) {
  //                     prisma.userHasRoles.create({
  //                       data:{
  //                         RoleId: res.RoleId,
  //                         UserId: resss.UserId
  //                       }
  //                     }).then(req => {
  //                       prisma.userlogin.create({
  //                         data: {
  //                           UserId: resss.UserId,
  //                           Username: ud.Username,
  //                           Password: ud.Password,
  //                           Credential: "credential"
  //                         }
  //                       }).then(() => {
  //                         console.log("Berhasil Seed User: " + ud.Nama)
  //                       })
  //                     })
  //                   }
  //                 } catch(ex) {
  //                   console.error(ex)
  //                 }
  //               })
  //             }
  //           } catch(ex) {
  //             console.error(ex)
  //           }
  //         })
  //       }
  //     } catch(e) {
  //       console.error(e)
  //     }
  //   })
  // })

  const data = [
    {
      MataKuliahId: '8de9c876-4682-41a1-a9bc-5ce64f812545',
      Nama: "Agama Islam",
      Capaian: [
        "Mampu memahami dan menjelaskan peranan Pendidikan Agama Islam dalam pengembangan kepribadian bangsa Indonesia",
        "Mampu menjelaskan pengertian manusia dan dimensinya, pengertian agama dan menjelaskan fungsi dan tujuan Agama",
        "Mampu menjelaskan Islam sebagai pandangan hidup, agama dan peradaban, hubungan dengan agama-agama lain dan menerapkan nilai-nilai islam dan kehidupan.",
        "Mampu menjelaskan pengertian peradaban Islam, sejarah kedatangan Islam di Nusantara",
        "Mampu memahami sumber ajaran Islam : Al-Qur'an dan Al-Hadis",
        "Mampu menyikapi perbedaan teologi, perbedaan madzhab fiqh dengan bijaksana dan cerdas",
        "Mampu melaksanakan tuntunan ibadah dalam keseharian sesuai dengan pinsip syari'ah dan fiqh islam",
        "Mampu memahami Akhlak Islam meliputi akhlak kepada Allah SWT, Rasulullah, Keluarga, lingkungan dan sesama",
        "Mampu berfikir rasional dan menjadikan rasionalitas sebagai dasar bagi pengembangan keilmuan Islam",
        "Mampu menghayati spirit ilmuan muslim dalam pengembangan sains dan ilmu pengetahuan masa depan dan mengimplementasikan integritas seorang muslim",
      ]
    },
    {
      MataKuliahId: "5769bd63-23e3-4d6d-af12-4dedd2171155",
      Nama: 'Agama Kristen Protestan',
      Capaian: [
        "mampu memahami tujuan dan fungsi MKWU Pendidikan Agama Kristen Protestan",
        "mampu memahami Allah dalam kepercayaan kristen protestan",
        "memahami Manusia menurut ajaran kristen protestan",
        "dapat memahami Etika dan pembentukan karakter Kristiani",
        "dapat memahami Hubungan Iman kristiano dengan ilmu pengetahuan, teknologi dan seni",
        "bisa menciptakan kerukunan antarumat beragama",
        "dapat memahami penjaga cipataan Allah",
        "mampu menerapkan cara bergaul yang baik",
      ]
    },
    {
      MataKuliahId: "2affb17e-d765-4b1f-bcfd-de9d484e4236",
      Nama: 'Agama Kristen Katholik',
      Capaian: [
        "dapat menjelaskan proses pengenalan akan Allah",
        "mampu mendeskripsikan gambaran tentang Tuhan yang diimani oleh Gereja",
        "mampu menjabarkan karya keselamatan Allah dalam dan melalui Gereja",
        "mampu menguraikan praktek ritual dan penghayatan iman dalam situasi nyata",
        "mampu menganalisis permasalahan hati nurani dan pengahayatan makna religius kerja",
        "mampu mempromosikan model penguatan toleransi beragama",
      ]
    },
    {
      MataKuliahId: "9bb5e5f8-d099-4ef3-868d-fd6c8e34ce2f",
      Nama: 'Agama Buddha/Hindu',
      Capaian: [
        "dapat menjelaskan Konsep Ketuhanan",
        "mampu menguraikan hakekat manusia dan kualitas batin yang menyangkut peran dan tanggung jawabnya dalam kehidupan.",
        "mampu memberikan argumen bahwa dirinya merupakan bagian dari masyarakat dan dapat berperan aktif dalam memajukan masyarakatnya",
        "mampu membandingkan berlakunya hukum yang dibuat manusia dengan hukum universal",
        "mampu memeriksa moralitas untuk mencapai kebahagiaan tertinggi, di samping samādhi dan pañña",
        "mampu memadukan peranan sains dan Ajaran Buddha dalam kehidupan sehari-hari",
        "mampu memahami tujuan dan fungsi MKWU Pendidikan Agama Hindu",
        "mampu memahamai bagaimana peran sejarah perkembangan agama Hindu dalam memberi pembelajaran positif.",
        "memahami ajaran brahma vidya (teologi) dalam membangun sraddha dan bhakti (iman dan takwa)",
        "dapat memahami peran studi veda dalam membangun pemahaman mahasiswa tentang eksistensi veda sebagai kitab suci dan sumber hukum",
        "dapat memahami konsep manusia Hindu dalam membangun kepribadian mahasiswa yang berjiwa pemimpin, taat hukum, sehat kreatif dan adaptif",
        "bisa memahami ajaran susila Hindu dalam membangun moralitas mahasiswa Hindu",
        "dapat memahami peran seni keagamaan serta mengaplikasikannya sehinga memunculkan kepribadian yang estetis",
        "dapat memahami dan membangun kerukunan sesuai ajaran Hindu",
        "mampu memahami dan membangun kesadaran mahasiswa sebagai mahluk sosial sesuai ajaran Hindu",
      ]
    },
    {
      MataKuliahId: "b3132e36-2f38-4e6c-a5dd-705567d642e7",
      Nama: 'Matematika 1',
      Capaian: [
        "Menguasai konsep-konsep matematika untuk memecahkan berbagai masalah yang berkaitan dengan logika.",
        "Mampu menyelesaikan persoalan nyata Fungsi",
        "Mampu menyelesaikan persoalan nyata Turunan",
        "Mampu menyelesaikan persoalan nyata Integral",
      ]
    },
    {
      MataKuliahId: "cea53023-4b0a-4f60-8ba1-8e031b985d9d",
      Nama: 'Bahasa Inggris',
      Capaian: [
        "Mampu menjelaskan unsur-unsur kalimat dan membuat kalimat yang baik dan benar sesuai dengan tata Bahasa baku Bahasa Inggris",
        "Mampu menjelaskan unsur-unsur paragraph dan mengembangkan gagasan/ide dalam bentuk paragraf",
        "Terampil membuat teks lisan maupun tulisan dalam Bahasa Inggris yang baik dan baku.",
        "Mampu memahami dan menganalisa isi teks bacaan secara komprehensif",
        "Mampu membuat paraphrase dan inferensi dalam Bahasa Inggris dari suatu teks bacaan guna mencegah plagiasi",
      ]
    },
    {
      MataKuliahId: "0ac25f9e-7c77-49cd-b9ca-b6dcf45b1436",
      Nama: 'Transformasi Digital ',
      Capaian: [
        "Menjelaskan berbagai bentuk transformasi dan disrupsi yang terjadi pada era digital saat ini dan dampaknya pada berbagai aspek kehidupan manusia.",
        "Merefleksikan budaya digital dalam kehidupan mahasiswa pada aspek-aspek: komunikasi sosial, kolaborasi, keamanan informasi, etika dan privasi.",
        "Mengidentifikasikan dasar-dasar perancangan dan pemodelan program serta cara berpikir mesin dan komputasi.",
        "Membuat program sederhana dengan Bahasa Pemrograman (Tools) tertentu.",
        "Merumuskan masalah dan menggambarkan prinsip, metode, teknologi, dan tools Teknologi Informasi dan Komunikasi (TIK): IoT dan Cyber-Physical Systems, Kecerdasan Buatan, Machine Learning, Big Data serta kesesuaiannya (fitness) dalam penyelesaian masalah.",
      ]
    },
    {
      MataKuliahId: "1434a404-447f-44ad-9aac-977d48363113",
      Nama: 'Pemrograman Dasar',
      Capaian: [
        "Memahami sejarah, konsep dasar dan jenis-jenis bahasa pemrograman",
        "Memahami cara pemecahan masalah menggunakan Bahasa Pemrograman, Algoritma, dan Pseudocode",
        "Mampu menggunakan metode-metode pada Bahasa pemrograman untuk membuat dan mengembangkan perangkat lunak.",
        "Mampu menggunakan Pustaka Python untuk pemecahan masalah pada lingkup Data Science",
      ]
    },
    {
      MataKuliahId: "d5690a5d-79e1-44f4-9ab3-bbad40e45a7e",
      Nama: 'Dasar Sistem Digital',
      Capaian: [
        "Mampu menerapkan pemikiran logis, kritis, sistimatis dan inovatif dalam kontek pengembangan atau implementasi ilmu pengetahuan dan teknologi yang memperhatikan dan menerapkan ilmu humaniora yang sesuai dengan bidang keahliannya",
        "Menentukan pendekatan sistem cerdas yang sesuai dengan problem yang dihadapi, memilih representasi pengetahuan dan mekanisme penalarannya",
        "Menganalisis dan mengembangkan sistem serta prasedur yang berkaitan dengan sistem komputer serta memberikan rekomendasi yang berkaitan dengan sistem komputer yang lebih efisien dan efektif",
        "Menerapkan konsep-konsep yang berkaitan dengan arsitektur dan organisasi komputerserta memanfaatkannya untuk menunjang aplikasi komputer.",
      ]
    },
    {
      MataKuliahId: "70d340f7-b83b-4109-8df4-1acc354472f0",
      Nama: 'Statistika 1',
      Capaian: [
        "Mampu untuk melakukan pengolahan data",
        "Mampu untuk menampilkan data yang sudah diolah",
        "Mampu untuk memberikan interpretasi terhadap pengolahan dan tampilan hasil survey",
        "Mampu untuk menyelesaikan masalah peluang",
        "Mampu untuk menentukan bentuk kurva dari data hasil survey",
      ]
    },
    {
      MataKuliahId: "93dff7c4-7912-4ed3-8e30-c7f2803074cf",
      Nama: 'Struktur Data',
      Capaian: [
        "Menunjukkan sikap bertanggungjawab atas pekerjaan di bidang keahliannya secara mandiri",
        "Bertanggung jawab secara profesional dan etik terhadap pencapaian hasil kerja kelompok.",
        "Memahami teori dan konsep Struktur Data.",
        "Memahami konsep struktur data.",
        "Memahami konsep dan penerapan Abstract Data Type (ADT).",
        "Mampu memahami konsep dan penerapan Array",
        "Mampu memahami konsep dan penerapan Linked List",
        "Mampu memahami konsep dan penerapan Stack",
        "Mampu memahami konsep dan penerapan Queue",
        "Mampu memahami konsep dan penerapan Sorting dan Searching",
        "Mampu memahami konsep dan penerapan Tree",
        "Mampu memahami konsep dan penerapan Graph",
      ]
    },
    {
      MataKuliahId: "ef60e60b-4dfa-4bb1-bb99-1d6bc6f9e1c7",
      Nama: 'Matematika 2',
      Capaian: [
        "Mampu menyelesaikan persoalan nyata barisan.",
        "Mampu menyelesaikan persoalan nyata deret",
        "Mampu menyelesaikan persoalan nyata menggunakan konsep PD Orde-1",
      ]
    },
    {
      MataKuliahId: "948c9094-fc18-4d51-b452-21d488bcd6ce",
      Nama: 'Interaksi Manusia dan Komputer',
      Capaian: [
        "Menunjukkan sikap bertanggungjawab atas pekerjaan di bidang keahliannya secara mandiri;",
        "Bertanggung jawab secara profesional dan etik terhadap pencapaian hasil kerja kelompok.",
        "Memahami pendekatan tingkah laku manusia dalam 2 aspek yaitu psikologi dan social organisasi dengan obyek obyek interaktif (KU1)",
        "Mahasiswa memiliki pengetahuan tentang konsep teoritis interaksi manusia dan komputer, konsep perancangan dan analisis interface/web, konsep evaluasi interface/web konsep pemrograman GUI serta konsep multimedia.",
        "Mampu menganalisis dan merancang interface yang baik sebagai implementasi dari pendekatan human centered",
        "Mampu mengevaluasi interface /web yang dihasilkan",
      ]
    },
    {
      MataKuliahId: "f21d44fc-ef94-48fd-ad86-b7163961b808",
      Nama: 'Matematika Diskrit',
      Capaian: [
        "Mampu melakukan penarikan inferensi yang benar berdasarkan data atau fakta yang ada",
        "Mampu mengenali berbagai alternatif penyelesaian suatu masalah",
        "Mampu memformulasikan cara berfikir ke dalam langah-langkah diskrit",
        "Menguasai konsep dn teori struktur diskrit, yang meliputi materi graft dan tree",
        "Mampu menjelaskan implementasi matematika diskrit dalam menyelesaikan persoalan nyata",
      ]
    },
    {
      MataKuliahId: "28a0795d-b04c-4acc-85be-cd2b64fbb79e",
      Nama: 'Pemrograman Berorientasi Objek',
      Capaian: [
        "Mampu Memahami sejarah, konsep dasar dan teori pemrograman berorientasi objek.",
        "Mampu menggunakan Bahasa pemrograman untuk membuat perangkat lunak berbasis pemrograman berorientasi objek",
        "Mampu memahami pengetahun tentang empat metode pemrograman berorientasi objek: inheritance, polymorphism, enkapsulasi, serta interface",
        "Mampu Menerapkan kecerdasan buatan dengan mengimplementasikan algoritma secara pendekatan yang berbeda",
      ]
    },
    {
      MataKuliahId: "57ac70a1-762d-4a2a-8692-e2cc77846d84",
      Nama: 'Dasar Arsitektur dan Organisasi Komputer',
      Capaian: [
        "Mampu menjelaskan pengenalan computer",
        "Mampu menjelaskan sistem komputer",
        "Mampu menjelaskan CPU",
        "Mampu menjelaskan unit kontrol",
        "Mampu menjelaskan organisasi paralel",
      ]
    },
    {
      MataKuliahId: "465527b4-aae2-43e1-b176-cefd1fb81528",
      Nama: 'Statistika 2',
      Capaian: [
        "Memahami konsep Statistik Inferensia",
        "Melakukan pendugaan nilai parameter populasi",
        "Melakukan pengujian Hipotesa",
      ]
    },
    {
      MataKuliahId: "85b80451-9b83-4ce9-823c-8f2cfc34b4c0",
      Nama: 'Pancasila',
      Capaian: [
        "mampu memahami konsep, esensi dan urgensi pendidikan Pancasila",
        "mampu memahami Sumber Historis, Sosiologis, Politis tentang pendidikan Pancasila",
        "mampu memahami Konsep Negara, Tujuan Negara dan Urgensi pendidikan Pancasila sebagai Dasar Negara",
        "mampu Menelusuri Konsep dan Urgensi Pancasila sebagai Ideologi Negara",
        "mampu Menelusuri Konsep dan Urgensi Pancasila sebagai Sistem Filsafat",
        "mampu Menelusuri Konsep dan Urgensi Pancasila sebagai Sistem Etika",
        "mampu memahami Pancasila sebagai Dasar Nilai Pengembangan Ilmu",
      ]
    },
    {
      MataKuliahId: "93522704-16ac-41d1-b35d-ac9f000f0591",
      Nama: 'Bahasa Indonesia',
      Capaian: [
        "Mampu menjelaskan pentingnya belajar bahasa Indonesia untuk mendukung kegiatan perkuliahan",
        "Terampil menerapkan ejaan dan menyusun definisi dengan tepat pada tulisan karya ilmiah",
        "Mampu memilih dan membentuk kata yang benar, mampu membuat kalimat yang baku dan mampu menerapkannya dalam paragraf.",
        "Terampil dalam menerapkan konvensi naskah karya tulis ilmiah dan mampu menghindari keplagiatan",
        "Mampu merancang dan membuat penulisan karya ilmiah",
      ]
    },
    {
      MataKuliahId: "b327937f-85c6-4145-b352-855cdaad112d",
      Nama: 'Aljabar Linier',
      Capaian: [
        "Memahami konsep matriks untuk menganalisis dan mengolah data",
        "Mampu menyelesaikan masalah Persamaan Linear",
        "Trampil menggunakan konsep-konsep aljabar linier untuk memecahkan berbagai masalah yang berkaitan dengan programa linier, analisis dan pengolahan data",
        "Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif dalam mengimplementasikan aljabar linier dan matriks",
      ]
    },
    {
      MataKuliahId: "5692e8e9-fef4-4ae0-8922-86ed71107a0c",
      Nama: 'Analisis dan Perancangan Sistem',
      Capaian: [
        "Menunjukkan sikap bertanggungjawab atas pekerjaan di bidang keahliannya secara mandiri;",
        "Mampu menguasai algoritma dan kompleksitas dengan cara mempelajari konsep-konsep sentral dan kecakapan yang dibutuhkan untuk merancang, menerapkan, dan menganalisis algoritma yang digunakan untuk pemodelan dan desain sistem berbasis komputer.",
        "Mampu merancang dan membangun suatu sistem dengan menggunakan pemrograman procedural dan berorientasi objek untuk menyelesaikan masalah.",
        "Memiliki pengetahuan terhadap alat bantu, pre-processing, pemrosesan dan post-processing terhadap data dengan melakukan analisis, memodelkan masalah dan mengimplementasikan solusi yang tepat terkait dengan pemrosesan data berbasis sistem cerdas untuk menghasilkan sistem cerdas yang adaptable, efektif, efisien, aman, dan optimal.",
      ]
    },
    {
      MataKuliahId: "2c76ca7c-174e-49de-9732-b84883e5b285",
      Nama: 'Pemrograman Visual',
      Capaian: [
        "Mampu memahami dan menggunakan Aplikasi Visual Basic",
        "Mampu memahami dan merancang program yang berbasis visual (Desktop).",
        "Mampu menggunakan library tambahan dalam pembuatan dan pengelolaan perangkat lunak yang berbasis visual Basic.",
      ]
    },
    {
      MataKuliahId: "8105702c-c282-43a0-a618-346f6bc1e613",
      Nama: 'Database 1',
      Capaian: [
        "Mempunyai kemampuan memahami konsep dasar dari database",
        "Mampu menggunakan framework dalam memahami perintah perintah dasar untuk membangun database",
        "Mampu membangun database pada kasus real di masyarakat",
        "Mampu memahami cara mengamankan data dalam database",
      ]
    },
    {
      MataKuliahId: "06a25d3c-34da-42c6-bc75-a81854c461ac",
      Nama: 'Sistem Operasi',
      Capaian: [
        "Mampu mempelajari model baru, teknik dan teknologi pada sistem operasi yang berkembang pada saat ini",
        "Mampu memiliki pengetahuan konsep dasar sistem operasi",
        "Mampu melakukan instalasi pada sistem operasi berbasis Windows dan Linux",
        "Mampu mengkonfigurasi sistem operasi berbasis Windows dan Linux",
        "Mampu mengoperasikan sistem operasi berbasis Windows dan Linux",
      ]
    },
    {
      MataKuliahId: "b036ab10-a1b2-4ed3-9798-92fe0678dc01",
      Nama: 'Kewarganegaraan',
      Capaian: [
        "Mahasiswa mampu memahami konsep pendidikan kewarganegaraan",
        "Mahasiswa mampu memahami esensi dan urgensi indentitas nasional dan integrasi nasional",
        "Mahasiswa mampu memahami nilai dan norma konstitusiona UUD NRI 1945",
        "Mahasiswa mampu memahami hakikat, instrumentasi, dan praksis demokrasi Indonesia berlandaskan Pancasila dan UUD NRI 1945",
        "Mahasiswa mampu memahami dinamika historis konstitusional, sosial-politik, kultural, serta konteks kontemporer penegakan hukum yang berkeadilan",
        "Mahasiswa mampu memahami dinamika historis, dan urgensi wawasan nusantara sebagai konsepsi dan pandangan kolektif kebangsaan indonesia dalam konteks pergaulan dunia",
        "Mahasiswa mampu memahami urgensi dan tantangan ketahanan nasional dan bela negara bagi Indonesia dalam membangun komitmen kolektif kebangsaan",
      ]
    },
    {
      MataKuliahId: "3365cf48-eb43-49f6-b2d0-f0c9a845945b",
      Nama: 'Dasar Kewirausahaan',
      Capaian: [
        "Memiliki wawasan baru tentang potensi wirausaha dan termotivasi untuk mengembangkan dirinya serta mampu mengubah cara berfikir dalam mengembangkan jiwa wirausaha",
        "Mampu berinovasi dan berkreasi untuk menghasilkan rancangan bisnis/produk (prototype) berbasis teknologi yang berorientasi pasar dengan memanfaatkan IPTEKS.",
        "Mampu menyusun proposal business plan yang siap diajukan kepada investor/penyandang dana.",
        "Bertanggung jawab pada pekerjaan sendiri dan dapat diberi tanggung jawab atas pencapaian hasil kerja tim dengan mengedepankan etika bisnis.",
      ]
    },
    {
      MataKuliahId: "1fa279bc-e687-4b08-93f7-85eb3abdef50",
      Nama: 'Pemrograman Berbasis Web',
      Capaian: []
    },
    {
      MataKuliahId: "ae7a6439-b9da-4909-a8c3-bd2e5abec44d",
      Nama: 'Rekayasa Perangkat Lunak',
      Capaian: [
        "Memahami konsep RPL.",
        "Mampu merancang suatu perangkat lunak dari hasil pemecahan masalah berdasarkan kasus yang diberikan baik secara mandiri maupun kerjasama tim mampu membuat dokumentasi dari kebutuhan sampai pengujian.",
        "Mampu membuat dokumentasi dari kebutuhan sampai pengujian.",
      ]
    },
    {
      MataKuliahId: "13598d0e-b23c-4ec8-a594-d4eaa968bee1",
      Nama: 'Database 2',
      Capaian: [
        "Memahami konsep database saat ini",
        "Memahami konsep database generasi yang akan datang (Next Generation Databases)",
      ]
    },
    {
      MataKuliahId: "3b7ebec3-98be-4aea-aa52-75b53243882e",
      Nama: 'Jaringan Komputer',
      Capaian: [
        "Mampu memiliki pengetahuan dasar jaringan komputer dengan memahami konsep arsitektur protokol dan fungsi-nya",
        "Mampu memahami berbagai aspek penggunaan dan desain jaringan komputer baik LAN maupun WAN",
        "Mampu merancang topologi dan arsitektur jaringan komputer dengan menggunakan tools jaringan untuk skala kecil dan menengah",
        "Mampu membangun jaringan komputer (Local Area Network) berbasiskan protokol TCP/IP",
        "Mampu melakukan administrasi jaringan komputer dalam hal setting IP, subnetting, dan routing",
      ]
    },
    {
      MataKuliahId: "8e1deff2-d7cc-432e-a373-1519cf38231e",
      Nama: 'Perancangan dan Analisa Algoritma',
      Capaian: [
        "Mampu menerapkan pemikiran logis, kritis,dan sistematis dalam memformulasikan persoalan nyata kedalam bentuk rancangan algoritma.",
        "Mampu menganalisa rancangan algoritma guna menentukan algoritma yang tepat sebagai solusi",
        "Mampu mengembangkan algoritma sesuai dengan masalah yang akan diselesaikan",
        "Mampu mengimplementasikan suatu algoritma menggunakan bahasa pemrograman dan/atau framework",
        "Mampu menerapkan sikap jujur dan bertanggung jawab dalam melaksanakan tugas",
      ]
    },
    {
      MataKuliahId: "7c057cbb-e1f3-462c-ae22-1997703817dc",
      Nama: 'Kecerdasan Buatan',
      Capaian: [
        "Mampu Memahami konsep dasar dan teori kecerdasan buatan berikut konsep dan turunan algoritmanya.",
        "Mampu menguasai cara perhitungan secara manual beberapa metode dasar beberapa sub bidang ilmu kecerdasan buatan",
        "Mampu memahami cara pemakai perangkat lunak open source (tools/library) untuk implelemntasi sub bidang ilmu kecerdasan buatan",
        "Mampu Menerapkan kecerdasan buatan dengan mengimplementasikan algoritma secara pendekatan yang berbeda",
      ]
    },
    {
      MataKuliahId: "08f3bfdb-c1a6-4f9f-847b-047b97f416be",
      Nama: 'Kewirausahaan Lanjut',
      Capaian: [
        "Memiliki wawasan baru tentang potensi wirausaha dan termotivasi untuk mengembangkan dirinya serta mampu mengubah cara berfikir dalam mengembangkan jiwa wirausaha",
        "Mampu berinovasi dan berkreasi untuk menghasilkan rancangan bisnis/produk (prototype) berbasis teknologi yang berorientasi pasar dengan memanfaatkan IPTEKS.",
        "Mampu menyusun proposal business plan yang siap diajukan kepada investor/penyandang dana",
        "Bertanggung jawab pada pekerjaan sendiri dan dapat diberi tanggung jawab atas pencapaian hasil kerja tim dengan mengedepankan etika bisnis.",
      ]
    },
    {
      MataKuliahId: "33975b76-54f6-427d-921b-e92b79169147",
      Nama: 'Machine Learning',
      Capaian: [
        "Mampu Memahami sejarah, konsep machine learning",
        "Mampu memahami konsep dasar klasifikasi",
        "Mampu memahami konsep dasar klastering",
        "Mampu memahami implementasi machine learning",
      ]
    },
    {
      MataKuliahId: "c36bcf15-c580-4667-8954-945c72cd2f15",
      Nama: 'Teknologi Multimedia',
      Capaian: [
        "Menunjukkan sikap bertanggungjawab atas pekerjaan di bidang keahliannya secara mandiri;",
        "Bertanggung jawab secara profesional dan etik terhadap pencapaian hasil kerja kelompok.",
        "Mahasiswa mampu memahami pendekatan tingkah laku manusia dalam 2 aspek yaitu psikologi dan social organisasi dengan obyek obyek interaktif",
        "Mahasiswa memiliki pengetahuan tentang konsep teoritis interaksi manusia dan komputer, konsep perancangan dan analisis interface/web, konsep evaluasi interface/web konsep pemrograman GUI serta konsep multimedia.",
        "mampu menganalisis dan merancang interface yang baik sebagai implementasi dari pendekatan human centered",
        "mampu mengevaluasi interface /web yang dihasilkan",
        "Mengetahui Representasi dan Kompresi Data Citra Statis.",
        "Mengetahui Representasi Data Animasi.",
        "Mengetahui Representasi dan Kompresi Data Suara.",
        "Mengetahui Representasi dan Kompresi Data Video.",
        "Mengetahui Perencanaan dan Manajemen Organisasi Produksi Multimedia.",
        "Mengetahui Pembiayaan, desain dan produksi multimedia.",
        "Mengetahui Distribusi Multimedia.",
        "Mengetahui Multimedia Jaringan, Layanan Jaringan dan Protokol.",
        "Mengetahui Multimedia dalam Augmented Reality dan Virtual Reality.",
        "Mengetahui Kebudayaan Dijital (digital Culture).",
      ]
    },
    {
      MataKuliahId: "0ec159c0-a4f2-4b53-88e0-984ef70eff91",
      Nama: 'Kecakapan Antar Personal',
      Capaian: [
        "Memiliki kemampuan mengenal dan meningkatkan kepribadian diri",
        "Memiliki kemampuan tentang ketrampilan yang berhubungan dengan orang lain (inter personal skill)",
        "Memiliki kemampuan tentang ketrampilan mengatur dirinya sendiri (intra personal skill)",
      ]
    },
    {
      MataKuliahId: "3e56ce11-1e3b-4a8c-8e3f-d34c87e5928d",
      Nama: 'Sistem Informasi',
      Capaian: [
        "Memahami Sistem Informasi sebagai solusi bisnis",
        "Mampu melakukan rancang bangun sistem informasi secara custom software development.",
        "Mampu mengimplementasikan sistem informasi secara package software implementation.",
      ]
    },
    {
      MataKuliahId: "f41dfff1-9589-4f4d-ba3a-9d2e90493d4a",
      Nama: 'Teknik Riset Operasional',
      Capaian: [
        "Memahami pengertian dan kegunaan teknik riset operasional untuk pengambilan keputusan dalam manajemen",
        "Mampu menerapkan pemikiran logis, kritis, dan sistematis dalam memformulasikan permasalahan nyata kedalam bentuk fungsi matematika",
        "Menguasai konsep teoritis teknik riset operasional serta mampu memformulasikan penyelesaian permasalahan optimasi",
        "Mampu mengimplementasikan suatu permasalahan riset operasional menggunakan bahasa pemrograman dan/atau framework",
        "Mampu menerapkan sikap jujur dan bertanggung jawab dalam melaksanakan tugas",
      ]
    },
    {
      MataKuliahId: "426001ad-778a-4496-84b9-9b9f1837bcc8",
      Nama: 'Mobile Cloud Computing',
      Capaian: [
        "Memahami konsep dan teknologi mobile computing",
        "Memahami konsep dan teknologi cloud computing",
        "Memahami konsep dan teknologi mobile cloud computing",
        "Memahami konsep dan teknologi offloading",
        "Memahami konsep dan teknologi green mobile cloud computing",
        "Memahami konsep dan teknologi alokasi sumberdaya mobile cloud computing",
        "Memahami konsep dan teknologi sensor mobile cloud computing",
        "Memahami konsep, permasalahan, teknologi dan mitigasi keamanan dan privasi mobile cloud computing",
        "Memahami konsep dan aspek bisnis mobile cloud computing",
        "Memahami konsep dan teknologi aplikasi mobile cloud computing",
      ]
    },
    {
      MataKuliahId: "ee86f96f-0e53-423e-a566-0328560580f0",
      Nama: 'Pemrograman Aplikasi Mobile',
      Capaian: [
        "Mahasiswa mampu membuat aplikasi mobile.",
        "Mahasiswa mampu menyelesaikan proyek akhir semester.",
      ]
    },
    {
      MataKuliahId: "4bbdc638-a2c9-4f11-8fbf-c5d7065c41e3",
      Nama: 'Jaringan Komputer Lanjut',
      Capaian: [
        "Mampu memiliki pengetahuan jaringan komputer terkini dengan memahami konsep arsitektur protokol dan fungsi lebih lanjut",
        "Mampu memahami berbagai aspek penggunaan dan desain jaringan komputer skala enterprise",
        "Mampu merancang topologi dan arsitektur jaringan komputer dengan menggunakan tools jaringan untuk skala enterprise",
        "Mampu membangun jaringan komputer (Local Area Network) skala enterprise dengan menerapkan keamanan jaringan di dalamnya",
        "Mampu melakukan administrasi jaringan komputer dalam hal setting IP, subnetting, dan routing intra AS dan antar automous system",
      ]
    },
    {
      MataKuliahId: "1919017a-cdfc-4a37-92dc-67099a279867",
      Nama: 'Keamanan Informasi',
      Capaian: [
        "Memahami pengertian dan prinsip-prinsip keamanan informasi, keamanan siber, keamanan jaringan komputer, dan keamanan komputer.",
        "Memahami, mampu menganalisis dan mengimplementasikan algoritma kriptografi sederhana.",
        "Memahami, mampu menganalisis dan mengimplementasikan teknologi otentikasi dan otorisasi sederhana",
        "Memahami, mampu menganalisis dan mengimplementasikan kontrol akses",
        "Memahami, mampu menganalisis jenis dan teknologi malware serta menerapkan best-practices untuk menanggulangi malware.",
        "Memahami, mampu menganalisis deteksi penyusup serta mengimplementasikan teknologi yang tersedia untuk menanggulangi penyusup.",
        "Memahami, mampu menganalisis dan menerapkan konsep keamanan perangkat lunak.",
        "Memahami, mampu menganalisis dan menerapkan solusi atas permasalahan manajemen sehubungan dengan keamanan informasi.",
        "Memahami, mampu menganalisis dan menerapkan teknologi dan solusi keamanan jaringan komputer.",
        "Memahami Etika dan permasalahan etis keamanan siber.",
      ]
    },
    {
      MataKuliahId: "504b510b-5f23-4863-8ffd-f94bf183e786",
      Nama: 'Sistem Paralel dan Terdistribusi',
      Capaian: [
        "Mahasiswa mampu mengidentifikasi kebutuhan akan paralelisme pada contoh-contoh kasus yang diberikan",
        "Mahasiswa memahami cara kerja high performance computer (HPC) sebagai mesin untuk melakukan komputasi paralel",
        "Mahasiswa mampu menganalisis, merancang, dan mengimplementasikan program-program paralel dan mendistribusikan task ke beberapa pemroses",
        "Mahasiswa mampu menganalisis kinerja program paralel yang sudah dibuat",
      ]
    },
    {
      MataKuliahId: "70f8f6e1-a4d4-49e3-8546-23ec291aacaf",
      Nama: 'Pemodelan dan Simulasi',
      Capaian: [
        "Mahasiswa memiliki kemampuan mampu membuat model & mensimulasikan.",
        "Mahasiswa memiliki kemampuan mengenerate Random number sesuai dengan masalahnya.",
        "Mahasiswa memiliki kemampuan mampu menyelesaikan persoalan nyata Pemodelan & Simulasi.",
      ]
    },
    {
      MataKuliahId: "bef57809-c6e0-498d-a117-bbaf1d3c11f8",
      Nama: 'Grafika Komputer',
      Capaian: [
        "Mahasiswa mampu menjelaskan bagaimana grafik komputer diolah.",
        "Mahasiswa mampu menggunakan API untuk memprogram grafika komputer.",
      ]
    },
    {
      MataKuliahId: "00df60a7-f648-44de-8b13-19255100c85a",
      Nama: 'Kerja Praktek',
      Capaian: [
        'Mampu mengimplementasikan sekumpulan teori yang sudah dipelajari dalam menyelesaikan masalah nyata di dunia kerja'
      ]
    },
    {
      MataKuliahId: "d9caaace-66ba-4541-860d-057e5c89dfae",
      Nama: 'Data Visualization',
      Capaian: [
        "Mampu Memahami sejarah, konsep dasar dan teori visualisasi data",
        "Mampu menggunakan tools framework untuk membuat visualisasi data",
        "Mampu mengimplementasikan model tertentu untuk membangun sistem visualisai data yang mudah digunakan (user friendly)",
        "Mampu mendeploy dashboard tertentu untuk membangun sistem cerdas",
      ]
    },
    {
      MataKuliahId: "1f9bb063-e734-4bf5-98d5-cd11b75edec1",
      Nama: 'IT Project',
      Capaian: [
        "Mampu menterjemahkan persoalan di dunia nyata menjadi spesifikasi kebutuhan software, mendesain, dan menggunakan framework untuk membuat model analisis dan model desain, atau mampu merancang dan mengimplementasikan topologi serta arsitektur jaringan komputer dan keamanannya untuk kebutuhan di dunia nyata.",
        "Mampu menangkap persoalan di dunia nyata dan menuangkannya dalam bentuk analisis kebutuhan, desain, implementasi dan pengujian aplikasi sistem cerdas atau mampu merancang, mengkonfigurasi, dan melakukan deployment infrastruktur server baik on-premise dan on-cloud serta IoT device untuk kebutuhan nyata masyarakat.",
        "Mampu mengembangkan aplikasi yang dibutuhkan oleh masyarakat agar sesuai dengan perkembangan teknologi atau mampu membuat kode program untuk mengotomasi sistem yang memenuhi kebutuhan nyata masyarakat.",
      ]
    },
    {
      MataKuliahId: "c17d408b-e565-41a4-a959-4724524c2aa1",
      Nama: 'Natural Language Processing / Pemrosesan Bahasa Natural',
      Capaian: [
        "Mampu memahami konsep, definisi, aplikasi Natural Language Processing.",
        "Mampu memahami bagian-bagian dasar dari NLP dan Teknik pemrosesannya.",
        "Mampu memahami dan mengimplementasikan Algoritma dalam penyelesaian masalah di bidang NLP.",
        "Mampu memahami dan mengimplementasikan teknologi terbaru terkait NLP.",
      ]
    },
    {
      MataKuliahId: "b75c3542-805a-4b90-ae49-c3b0db306f0f",
      Nama: 'Data Mining',
      Capaian: [
        "dapat menjelaskan latar belakang munculnya teknik data mining, serta tahapan-tahapan umum dalam proses data mining",
        "dapat menjelaskan definisi data, dan proses awal yang dilakukan terhadap data agar dapat menjadi inputan yang baik dalam teknik data mining",
        "dapat menjelaskan teknikteknik merepresentasikan data",
        "dapat menjelaskan teknik klasifikasi dalam data mining",
        "memahami teknik/metoda analisis asosiasi dalam data mining",
        "dapat menjelaskan teknik klustering dalam data mining",
        "dapat menjelaskan bagaimana menangani anomali data, dan mendeteksi adanya anomali data",
        "dapat menjelaskan gambaran aplikasi data mining dalam berbagai bidang",
        "mampu Memilih dan menerapkan teknik Data Mining mulai dari persiapan data sampai dengan task data mining dalam menyelesaikan permasalahan sesuai dengan studi kasus yang ada",
      ]
    },
    {
      MataKuliahId: "724b02f8-cfa7-484f-a201-f1b876114c2d",
      Nama: 'Etika Profesi',
      Capaian: [
        "mampu memahami nilai-nilai etika umum dan etika profesi secara khusus",
        "mampu meningkatkan internalisasi nilai-nilai etika umum dan etika profesi secara khusus",
      ]
    },
    {
      MataKuliahId: "a83cfb74-1158-4e79-9341-a5ab3da503fe",
      Nama: 'Pegembangan Aplikasi Enterprise',
      Capaian: [
        "Memahami definisi aplikasi enterprise",
        "Memahami latar belakang kebutuhan aplikasi enterprise",
        "Memahami berbagai framework arsitektur aplikasi enterprise",
        "Memahami dan mampu melakukan proses rancang bangun aplikasi enterprise",
      ]
    },
    {
      MataKuliahId: "adab4d8d-3b96-45de-9705-604a905da0f8",
      Nama: 'Pengolahan Citra',
      Capaian: [
        "Memahami konsep dasar representasi citra digital.",
        "Memahami karakteristik citra digital.",
        "Memahami proses transformasi geometri dan operasi aljabar yang dapat dikenakan pada citra digital.",
        "Memahami algoritma dan pseudocode proses transformasi geometri serta operasi aljabar yang dapat dikenakan pada citra digital.",
        "Memahami fungsi dan proses konvolusi terhadap suatu citra digital.",
        "Memahami pemakaian teknik enhancement pada citra digital",
        "Mampu menerapkan proses penghilangan derau (noise) pada sebuah citra",
        "Memahami definisi ekstraksi ciri/ ekstraksi fitur (feature extraction) pada citra digital",
        "Mampu menganalisis proses ekstraksi fitur pada citra digital sesuai dengan permasalahan yang dihadapi",
      ]
    },
    {
      MataKuliahId: "1ff47341-98cb-4526-adb5-05a81a93acf3",
      Nama: 'eCommerce',
      Capaian: [
        "Mampu mendefinisikan trend, kebutuhan pasar e-commerce Indonesia",
        "Mampu memahami konsep, tipe, karakteristik dan model bisnis e-commerce",
        "Mampu melakukan manajerial tim dan kerjasama tim dalam hal membuat, melaporkan dan presentasi hasil proyek prototype e-commerce",
        "Mampu merancang aplikasi prototype web / mobile commerce",
      ]
    },
    {
      MataKuliahId: "b309f4c9-fbaf-4955-b79f-142b13db67ab",
      Nama: 'Penjaminan Mutu Perangkat Lunak',
      Capaian: [
        "Memahami project management, QA, QC, dan PMP pada industri piranti lunak",
        "Memahami penerapan project management pada metodologi rancang bangun piranti lunak",
        "Memahami tindak lanjut proses dan mekanisme QA dan QC pada metodologi rancang bangun piranti lunak sebagai bagian dari project management",
      ]
    },
    {
      MataKuliahId: "98f3d9d6-61c0-42da-a481-b7328bfc6f75",
      Nama: 'Pemrograman Game',
      Capaian: [
        "Memahami proses rancang bangun game secara umum",
        "Memahami dan mampu melakukan proses rancang bangun game dengan game engine Unity",
      ]
    },
    {
      MataKuliahId: "b9763b9d-9267-442d-94c4-bde2d2776167",
      Nama: 'Pemrograman Semantik Web',
      Capaian: [
        "Memahami definisi, karakteristik, dan latar beakang Web 3.0",
        "Memahami dan mampu melakukan proses rancang bangun dan implementasi Web 3.0",
      ]
    },
    {
      MataKuliahId: "00ea0eb1-c8e1-4ab8-a005-758e9d5833c1",
      Nama: 'Big Data Analytic',
      Capaian: [
        "Mampu Memahami sejarah, konsep dasar dan teori big data analytic (CPL414)",
        "Mampu menggunakan bahasa pemrograman dan framework untuk membuat perangkat lunak (CPL414)",
        "Mampu mengimplementasikan algoritma tertentu untuk membangun sistem cerdas yang mudah digunakan (user friendly) (CPL425)",
        "Mampu mendeploy algoritma tertentu untuk membangun sistem cerdas (CPL425)",
      ]
    },
    {
      MataKuliahId: "9f27df37-3d72-4e09-b079-f6fb41f94c43",
      Nama: 'Digital Forensic',
      Capaian: [
        "Memahami kode etik yang berhubungan dengan pengumpulan, duplikasi, analisis, penyimpulan dan distribusi data dan informasi terkait insiden keamanan siber.",
        "Memahami profesi investigator forensik komputer.",
        "Memahami, mampu menganalisis dan menerapkan konsep, prosedur dan teknologi forensik komputer.",
        "Memiliki kemampuan untuk mengidentifikasi dan mengumpulkan bukti-bukti yang cukup dan layak sesuai standar hukum untuk disajikan di pangadilan.",
        "Kode etik, etika dan permasalahan etis keamanan siber penekanan pada profesi forensik digital.",
      ]
    },
    {
      MataKuliahId: "51d543f6-fa2f-4035-b3fe-4191af49fa55",
      Nama: 'Kriptografi',
      Capaian: [
        "Memahami konsep keamanan siber, kriptografi, kriptoanalisis dan etika keamanan siber.",
        "Memahami konsep, algoritma dan implementasi kriptografi klasik",
        "Memahami konsep, algoritma dan implementasi sistem bilangan pada kriptografi",
        "Memahami konsep, algoritma dan implementasi kriptografi simetris",
        "Memahami konsep, algoritma dan implementasi kriptografi asimetris",
        "Memahami konsep, algoritma dan implementasi fungsi hash",
        "Memahami konsep, algoritma dan implementasi message authentication code (MAC)",
        "Memahami konsep, algoritma dan implementasi digital signature",
        "Memahami konsep, algoritma dan implementasi manajemen dan distribusi kunci",
        "Memahami konsep, algoritma dan implementasi kontrol akses",
        "Memahami konsep, algoritma dan implementasi kriptoanalisis",
      ]
    },
    {
      MataKuliahId: "b24ba9e2-6a6f-491b-b30c-7381cfa73a40",
      Nama: 'Pengembangan Microservices',
      Capaian: [
        "Memahami konsep, prinsip , karakteristik, kelebihan, kekurangan, dan latar belakang microservices",
        "Memahami dan mampu melakukan rancang bangun dan penerapan microservices secara umum",
        "Memahami dan mampu menerapkan teknologi-teknologi microservices secara spesifik",
      ]
    },
    {
      MataKuliahId: "55202360-2ec4-4c8e-940c-27655f8ad08b",
      Nama: 'Internet of Things',
      Capaian: [
        "Memahami konsep, karakteristik, latar belakang, dan contoh penerapan/best practices IoT",
        "Memahami dan mampu menerapkan berbagai macam teknologi IoT",
        "Memahami dan mampu membangun arsitektur IoT",
        "Memahami dan mampu melakukan rancang bangun dan penerapan IoT",
      ]
    },
    {
      MataKuliahId: "842def4b-5113-4b4e-a2fc-8e0253b28f69",
      Nama: 'Administrasi Sistem',
      Capaian: [
        "Mampu mempelajari model baru, teknik dan teknologi pada administrasi sistem yang berkembang pada saat ini",
        "Mampu memiliki pengetahuan konsep dasar dalam administrasi sistem",
        "Mampu melakukan instalasi pada sistem operasi berbasis Windows atau Linux",
        "Mampu mengelola server berbasis Windows atau Linux",
        "Mampu melakukan instalasi dan konfigurasi pada virtual machine dan kontainer",
      ]
    },
    {
      MataKuliahId: "2d3e1b97-59da-4f4a-ace0-a2fa378c9e93",
      Nama: 'Network Security',
      Capaian: [
        "Memahami konsep serangan, layanan dan mekanisme keamanan jaringan komputer.",
        "Memahami konsep, algoritma dan implementasi enkripsi simetrik dan kerahasiaan pesan.",
        "Memahami konsep, algoritma dan implementasi enkripsi asimetrik dan otentikasi pesan.",
        "Memahami konsep, algoritma dan implementasi distribusi kunci dan otentikasi user.",
        "Memahami konsep, algoritma dan implementasi kontrol akses jaringan dan keamanan cloud.",
        "Memahami konsep, algoritma dan implementasi keamanan level transport",
        "Memahami konsep, algoritma dan implementasi keamanan jaringan wireless",
        "Memahami konsep, algoritma dan implementasi keamanan email dan IP",
        "Memahami konsep, algoritma dan implementasi malware dan intruder",
        "Memahami konsep, algoritma dan implementasi firewall dan manajemen keamanan jaringan serta riset dibidang keamanan jaringan",
      ]
    },
  ]

  const temp = data.flatMap(d => (
    d.Capaian.map((c, idx: number) => ({
      MataKuliahId: d.MataKuliahId,
      Nama: c,
      Urutan: idx + 1,
      Active: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      DeletedAt: null
    }))
  ));

  await prisma.capaianPembelajaran.createMany({
    data: temp
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
