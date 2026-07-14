class Course{
    constructor({
        moodleCode,
        code = "",
        name = "",
        hasUniqueAvaluation = false,
        minimumAttendance = 0,
        hasRAsPercentage = false
    }) {
        this.moodleCode = moodleCode;
        this.code = code;
        this.name = name;
        this.hasUniqueAvaluation = hasUniqueAvaluation;
        this.minimumAttendance = minimumAttendance;
        this.hasRAsPercentage = hasRAsPercentage;

        
        /** @type {Activity[]} */
        this.ordinary = [];

        
        /** @type {Activity[]} */
        this.extraordinary = [];
    }
}

class Activity{
    constructor({
        code,
        weight = 0,
        minGradeToPass = 0,
        maxGrade = 10
    }) {
        this.code = code;
        this.weight = weight;
        this.minGradeToPass = minGradeToPass;
        this.maxGrade = maxGrade;

        /** @type {Activity[]} */
        this.subActivities = [];
    }

        /**
     * Add a sub-activity.
     * @param {Activity} activity
     */
    addSubActivity(activity) {
        if (!(activity instanceof Activity)) {
            throw new Error("Sub-activity must be an Activity instance.");
        }

        this.subActivities.push(activity);
    }

    /**
     * Remove a sub-activity by code.
     * @param {string} code
     * @returns {boolean}
     */
    removeSubActivity(code) {
        const index = this.subActivities.findIndex(a => a.code === code);

        if (index === -1) {
            return false;
        }

        this.subActivities.splice(index, 1);
        return true;
    }

    /**
     * Find a sub-activity recursively.
     * @param {string} code
     * @returns {Activity|null}
     */
    findActivity(code) {
        if (this.code === code) {
            return this;
        }

        for (const activity of this.subActivities) {
            const found = activity.findActivity(code);
            if (found) {
                return found;
            }
        }

        return null;
    }
}
class RecoveryActivity extends Activity{
    constructor({
        code,
        weight = 0,
        minGradeToPass = 0,
        maxGrade = 10
    }) {
        this.code = code;
        this.weight = weight;
        this.minGradeToPass = minGradeToPass;
        this.maxGrade = maxGrade;

        /** @type {RecoveryActivity[]} */
        this.subActivities = [];
    }

        /**
     * Add a sub-activity.
     * @param {RecoveryActivity} activity
     */
    addSubActivity(activity) {
        if (!(activity instanceof RecoveryActivity)) {
            throw new Error("Sub-activity must be an Activity instance.");
        }

        this.subActivities.push(activity);
    }

    /**
     * Remove a sub-activity by code.
     * @param {string} code
     * @returns {boolean}
     */
    removeSubActivity(code) {
        const index = this.subActivities.findIndex(a => a.code === code);

        if (index === -1) {
            return false;
        }

        this.subActivities.splice(index, 1);
        return true;
    }

    /**
     * Find a sub-activity recursively.
     * @param {string} code
     * @returns {RecoveryActivity|null}
     */
    findActivity(code) {
        if (this.code === code) {
            return this;
        }

        for (const activity of this.subActivities) {
            const found = activity.findActivity(code);
            if (found) {
                return found;
            }
        }

        return null;
    }
}