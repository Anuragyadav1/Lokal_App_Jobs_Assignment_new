import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchJobs } from "../services/api";

const { width } = Dimensions.get("window");

// Utility function to generate a truly unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const JobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [processedIds] = useState(new Set());

  const processJobData = (jobData) => {
    return jobData.map((job) => {
      const uniqueId = generateUniqueId();
      processedIds.add(uniqueId);
      return {
        ...job,
        uniqueId,
      };
    });
  };

  const loadJobs = async (pageNumber = 1, shouldRefresh = false) => {
    if (loading || (!hasMore && !shouldRefresh)) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobs(pageNumber);

      if (data && data.length > 0) {
        const processedData = processJobData(data);

        if (shouldRefresh) {
          processedIds.clear();
          setJobs(processedData);
        } else {
          setJobs((prevJobs) => {
            const newJobs = processedData.filter(
              (newJob) =>
                !prevJobs.some((existingJob) => existingJob.id === newJob.id)
            );
            return [...prevJobs, ...newJobs];
          });
        }
        setPage(pageNumber + 1);
        setHasMore(data.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error in loadJobs:", err);
      setError(
        "Failed to load jobs. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    loadJobs(1, true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="briefcase" size={32} color="#007AFF" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Available Jobs</Text>
        </View>
      </View>
      <View style={styles.headerDivider} />
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  if (error && jobs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRefresh}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color="white"
            style={styles.retryIcon}
          />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && jobs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate("JobDetail", { job: item })}
          />
        )}
        keyExtractor={(item) => item.uniqueId}
        onEndReached={() => hasMore && loadJobs(page)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.centerContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="search-outline" size={64} color="#666" />
              </View>
              <Text style={styles.emptyText}>
                No jobs available at the moment.{"\n"}
                Pull down to refresh!
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "white",
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 28,
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default JobsScreen;
