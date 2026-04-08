"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumeDocument from "./ResumeDocument";
import { LinkedInProfile } from "../../types/profile";
import { SectionItem } from "../views/SectionManager";

interface Props {
  profile: LinkedInProfile;
  layoutOrder: SectionItem[];
}

export default function ResumeDownloadButton({ profile, layoutOrder }: Props) {
  // @react-pdf is notoriously buggy with state updates causing 'ghosting' or duplication in the buffer.
  // We force a hyper-unique key that tracks the layout order AND the content IDs to guarantee a fresh instance.
  const pdfKey = [
    ...layoutOrder.map(s => s.id),
    ...profile.experiences.map(e => e.id),
    ...profile.educations.map(e => e.id),
    ...profile.skills.map(s => s.id),
  ].join('_');

  return (
    <PDFDownloadLink
      key={pdfKey}
      document={<ResumeDocument profile={profile} layoutOrder={layoutOrder} />}
      fileName="resume.pdf"
      className="inline-flex h-12 w-full items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 sm:w-auto mt-4"
    >
    Download Final Resume
    </PDFDownloadLink>
  );
}
