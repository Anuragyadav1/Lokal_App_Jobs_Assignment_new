import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBookmarks } from "../context/BookmarkContext";

const { width } = Dimensions.get("window");

const DetailItem = ({ icon, title, content, onPress, style, textStyle }) => (
  <TouchableOpacity
    style={[styles.detailItem, style]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={24} color="#007AFF" />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text
        style={[styles.detailText, onPress && styles.clickableText, textStyle]}
      >
        {content}
      </Text>
    </View>
  </TouchableOpacity>
);

const Section = ({ title, children, style }) => (
  <View style={[styles.section, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Tag = ({ text, bgColor, textColor }) => (
  <View style={[styles.tag, { backgroundColor: bgColor || "#F0F8FF" }]}>
    <Text style={[styles.tagText, { color: textColor || "#007AFF" }]}>
      {text}
    </Text>
  </View>
);

const JobDetailScreen = ({ route }) => {
  const { job } = route.params;
  const [bookmarked, setBookmarked] = useState(false);
  const { checkJobBookmarkStatus, toggleJobBookmark, bookmarkedIds } =
    useBookmarks();

  useEffect(() => {
    checkBookmarkStatus();
  }, [job.id, bookmarkedIds]);

  const checkBookmarkStatus = async () => {
    const status = await checkJobBookmarkStatus(job.id);
    setBookmarked(status);
  };

  const handleBookmarkPress = async () => {
    const newStatus = await toggleJobBookmark(job);
    setBookmarked(newStatus);
  };

  const handlePhonePress = () => {
    if (job.phone) {
      Linking.openURL(`tel:${job.phone}`);
    }
  };

  const handleWhatsAppPress = () => {
    if (job.companyDetails?.whatsappLink) {
      Linking.openURL(job.companyDetails.whatsappLink);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      {job.media?.images?.length > 0 && (
        <Image
          source={{ uri: job.media.images[0].url }}
          style={styles.headerImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{job.title}</Text>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={28}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.company}>{job.company}</Text>
        {job.additionalInfo?.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium Job</Text>
          </View>
        )}

        {job.additionalInfo?.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {job.additionalInfo.tags.map((tag, index) => (
              <Tag
                key={index}
                text={tag.value}
                bgColor={tag.bgColor}
                textColor={tag.textColor}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Section title="Key Details">
          <DetailItem icon="location" title="Location" content={job.location} />
          <DetailItem icon="cash" title="Salary" content={job.salary} />
          <DetailItem icon="briefcase" title="Job Type" content={job.jobType} />
          <DetailItem icon="time" title="Experience" content={job.experience} />
          <DetailItem
            icon="school"
            title="Qualification"
            content={job.requirements}
          />
          <DetailItem
            icon="people"
            title="Openings"
            content={`${job.openings} positions`}
          />
          {job.fees && (
            <DetailItem icon="card" title="Fees" content={job.fees} />
          )}
        </Section>

        <Section title="Contact Information">
          {job.phone && (
            <DetailItem
              icon="call"
              title="Phone"
              content={job.companyDetails?.buttonText || `Call: ${job.phone}`}
              onPress={handlePhonePress}
              style={styles.callButton}
            />
          )}
          {job.companyDetails?.whatsappLink && (
            <DetailItem
              icon="logo-whatsapp"
              title="WhatsApp"
              content="Chat on WhatsApp"
              onPress={handleWhatsAppPress}
              style={styles.whatsappButton}
              textStyle={styles.whatsappText}
            />
          )}
          {job.companyDetails?.callStartTime && (
            <DetailItem
              icon="time"
              title="Preferred Call Time"
              content={`${job.companyDetails.callStartTime} - ${job.companyDetails.callEndTime}`}
            />
          )}
        </Section>

        {job.description && (
          <Section title="Job Description">
            <Text style={styles.descriptionText}>{job.description}</Text>
          </Section>
        )}

        {Object.keys(job.additionalInfo?.contentV3 || {}).length > 0 && (
          <Section title="Additional Information">
            {Object.entries(job.additionalInfo.contentV3).map(
              ([key, info], index) => (
                <DetailItem
                  key={index}
                  icon="information-circle"
                  title={info.name}
                  content={info.value}
                />
              )
            )}
          </Section>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={20} color="#666" />
            <Text style={styles.statText}>
              {job.additionalInfo?.views || 0} views
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="share-outline" size={20} color="#666" />
            <Text style={styles.statText}>
              {(job.additionalInfo?.shares || 0) +
                (job.additionalInfo?.fbShares || 0)}{" "}
              shares
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={styles.statText}>
              {job.additionalInfo?.applications || 0} applications
            </Text>
          </View>
        </View>

        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            Posted: {new Date(job.createdOn).toLocaleDateString()}
          </Text>
          <Text style={styles.dateText}>
            Expires: {new Date(job.expiresOn).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerImage: {
    width: width,
    height: width * 0.6,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 16,
  },
  company: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  clickableText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  bookmarkButton: {
    padding: 4,
  },
  callButton: {
    backgroundColor: "#007AFF",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  whatsappText: {
    color: "white",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  premiumText: {
    color: "#FFB800",
    fontWeight: "600",
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: "#666",
    fontSize: 14,
  },
  dateInfo: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  dateText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
});

export default JobDetailScreen;
