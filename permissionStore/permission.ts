// // Define the type for permissions
// export interface Permissions {
//     canViewCourses: boolean;
//     canEnrollInCourse: boolean;
//     canAddCourse: boolean;
//     canViewAnalytics: boolean;
//     canAddInstructor: boolean;
//     canUpdateCourseContent: boolean;
//     canGradeAssignments: boolean;
//     canManageCourseMaterials: boolean;
//     canViewGrades: boolean;
//     canViewProfile: boolean;
//     canManageUsers: boolean;
//     canAddAdminPermissions: boolean;
//     canViewInstructors: boolean;
//     canManageCourses: boolean;
//     canViewCourseList: boolean;
//     canManageCourseSettings: boolean;
//     canReserveClassroom: boolean;
//     canRequestAssistance: boolean;
//     canPostAnnouncements: boolean;
//     canViewAnnouncements: boolean;
//     canViewAssignments: boolean;
//     canSubmitAssignment: boolean;
//     canViewPaymentHistory: boolean;
//     canAddNotifications: boolean;
//     canViewNotifications: boolean;
//     canManageSettings: boolean;
//     canManageQuestions: boolean;
//     canCreateQuizzes: boolean;
//     canAccessFlashcards: boolean;
//     canCreateFlashcards: boolean;
//     canPlayLearningGames: boolean;
//     canLearnHowToCode: boolean;
// }

// // Default empty permissions
// let permissions: Permissions = {} as Permissions;

// // Function to set permissions
// export function setPermissions(newPermissions: Permissions): void {
//     permissions = newPermissions;
// }

// // Function to get permissions
// export function getPermissions(): Permissions {
//     return permissions;
// }


class PermissionsManager {
    private static instance: PermissionsManager;
    private permissions: Record<string, boolean> = {};

    private constructor() {
        // Load permissions from localStorage on initialization
        const storedPermissions = localStorage.getItem("permissions");
        if (storedPermissions) {
            try {
                this.permissions = JSON.parse(storedPermissions);
                console.log("Loaded permissions from localStorage:", this.permissions);
            } catch (error) {
                console.error("Failed to parse stored permissions:", error);
            }
        }
    }

    public static getInstance(): PermissionsManager {
        if (!PermissionsManager.instance) {
            PermissionsManager.instance = new PermissionsManager();
        }
        return PermissionsManager.instance;
    }

    public setPermissions(permissionsString: string): void {
        try {
            const parsedPermissions = JSON.parse(permissionsString);
            if (typeof parsedPermissions === "object" && parsedPermissions !== null) {
                this.permissions = parsedPermissions;
                console.log("Permissions successfully set:", this.permissions);
            } else {
                console.warn("Invalid permissions format:", parsedPermissions);
            }
        } catch (error) {
            console.error("Error parsing permissions JSON:", error);
        }
    }

    public clearPermissions(): void {
        this.permissions = {};
        localStorage.removeItem("permissions");
        console.log("Permissions cleared!");
    }

    public getPermissions(): Record<string, boolean> {
        return this.permissions;
    }
}

export { PermissionsManager };
