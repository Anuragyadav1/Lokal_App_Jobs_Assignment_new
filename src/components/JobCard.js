import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBookmarks } from "../context/BookmarkContext";

const { width } = Dimensions.get("window");

const JobCard = ({ job, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {job.title}
          </Text>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                {job.location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                {job.salary}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                {job.phone}
              </Text>
            </View>
            {job.company && (
              <View style={styles.detailItem}>
                <Ionicons name="business-outline" size={16} color="#666" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {job.company}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: width - 32, // Full width minus margins
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  bookmarkButton: {
    padding: 4,
  },
});

export default JobCard;
