import React from 'react'

export default function PersetujuanAsesor({universityDataServer}: {universityDataServer:{
    Nama: string;
    UniversityId: string;
    ProgramStudi: {
        Nama: string;
        ProgramStudiId: string;
    }[];
}[]}) {
  return (
    <div>PersetujuanAsesor</div>
  )
}
