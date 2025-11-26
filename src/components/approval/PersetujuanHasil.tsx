import React from 'react'

export default function PersetujuanHasil({universityDataServer}: {universityDataServer:{
    Nama: string;
    UniversityId: string;
    ProgramStudi: {
        Nama: string;
        ProgramStudiId: string;
    }[];
}[]}) {
  return (
    <div>PersetujuanHasil</div>
  )
}
