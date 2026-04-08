import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { LinkedInProfile } from "../../types/profile";
import { SectionItem } from "../views/SectionManager";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#ffffff", color: "#333333" },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5, paddingBottom: 2 },
  profilePic: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  headerTextContainer: { flex: 1 },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  headline: { fontSize: 12, color: "#666666" },
  footer: { position: "absolute", fontSize: 10, bottom: 30, left: 40, right: 40, textAlign: "center", color: "#999999" },
  sectionTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginBottom: 6, marginTop: 8, borderBottomWidth: 0.5, borderBottomColor: "#cccccc", paddingBottom: 4 },
  entryItem: { marginBottom: 8 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 },
  entryTitle: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  entryDates: { fontSize: 9, fontFamily: "Helvetica-Oblique", color: "#777777" },
  entryCompany: { fontSize: 10, fontFamily: "Helvetica-Oblique", color: "#555555", marginBottom: 4 },
  entryLocation: { fontSize: 9, color: "#888888", marginTop: 1 },
  entryDescription: { fontSize: 10, lineHeight: 1.4, color: "#444444" },
  skillsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  skillTag: { backgroundColor: "#f1f5f9", paddingVertical: 3, paddingHorizontal: 6, borderRadius: 4, marginRight: 6, marginBottom: 6, fontSize: 9, color: "#334155", fontFamily: "Helvetica-Bold" },
});

interface ResumeDocumentProps {
  profile: LinkedInProfile;
  layoutOrder: SectionItem[];
}

const ResumeDocument: React.FC<ResumeDocumentProps> = ({ profile, layoutOrder }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.headerContainer} fixed>
          {profile.profilePictureBase64 && (
            <Image src={profile.profilePictureBase64} style={styles.profilePic} />
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.headline}>{profile.headline}</Text>
          </View>
        </View>

        {/* Dynamic Re-Ordered Body */}
        {layoutOrder.map((section) => {
          switch (section.id) {
            case 'experience':
              if (!profile.experiences || profile.experiences.length === 0) return null;
              return (
                <View key="exp">
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {profile.experiences.map((exp) => {
                    const hasDates = exp.startDate || (exp.endDate && exp.endDate !== 'Present');
                    return (
                      <View key={exp.id} style={styles.entryItem} wrap={false}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>{exp.title}</Text>
                          {hasDates && (
                            <Text style={styles.entryDates}>
                              {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}
                            </Text>
                          )}
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={styles.entryCompany}>{exp.company}</Text>
                          {exp.location && <Text style={styles.entryLocation}>{exp.location}</Text>}
                        </View>
                        {exp.description && <Text style={styles.entryDescription}>{exp.description}</Text>}
                      </View>
                    );
                  })}
                </View>
              );

            case 'education':
              if (!profile.educations || profile.educations.length === 0) return null;
              return (
                <View key="edu">
                  <Text style={styles.sectionTitle}>Education</Text>
                  {profile.educations.map((edu) => {
                    const hasValidDegree = edu.degree && !edu.degree.toLowerCase().includes('unknown');
                    return (
                      <View key={edu.id} style={styles.entryItem} wrap={false}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>
                            {!hasValidDegree ? (edu.institution || "Education") : edu.degree}
                            {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                          </Text>
                          {(edu.startDate && edu.startDate !== 'Unknown' && edu.startDate !== '') && (
                            <Text style={styles.entryDates}>
                              {edu.startDate} - {edu.endDate}
                            </Text>
                          )}
                        </View>
                        {hasValidDegree && <Text style={styles.entryCompany}>{edu.institution}</Text>}
                      </View>
                    );
                  })}
                </View>
              );

            case 'projects':
              if (!profile.projects || profile.projects.length === 0) return null;
              return (
                <View key="proj">
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {profile.projects.map((proj) => (
                    <View key={proj.id} style={styles.entryItem} wrap={false}>
                      <View style={styles.entryHeader}>
                        <Text style={styles.entryTitle}>{proj.title}</Text>
                        {(proj.startDate || proj.endDate) && (
                          <Text style={styles.entryDates}>
                            {proj.startDate}{proj.startDate && proj.endDate ? ' - ' : ''}{proj.endDate}
                          </Text>
                        )}
                      </View>
                      {proj.description && <Text style={styles.entryDescription}>{proj.description}</Text>}
                    </View>
                  ))}
                </View>
              );

            case 'certifications':
              if (!profile.certifications || profile.certifications.length === 0) return null;
              return (
                <View key="cert">
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  {profile.certifications.map((cert) => (
                    <View key={cert.id} style={styles.entryItem} wrap={false}>
                      <View style={styles.entryHeader}>
                        <Text style={styles.entryTitle}>{cert.name}</Text>
                        {(cert.startDate || cert.endDate) && (
                          <Text style={styles.entryDates}>
                            {cert.startDate}{cert.startDate && cert.endDate ? ' - ' : ''}{cert.endDate}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.entryCompany}>{cert.authority}</Text>
                    </View>
                  ))}
                </View>
              );

            case 'skills':
              if (!profile.skills || profile.skills.length === 0) return null;
              return (
                <View key="skills" wrap={false}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  <View style={styles.skillsContainer}>
                    {profile.skills.map((skill) => (
                      <View key={skill.id} style={styles.skillTag}>
                        <Text>{skill.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );

            default:
              return null;
          }
        })}

        {/* Fixed Footer */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default ResumeDocument;
