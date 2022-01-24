package inspections.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"

    static class DataSource {

        static final String FVIBERI = "fviberi"
        static final String SCHEDULES = "schedules"

    }

    static class DateFormat {

        static final String MMM_yyyy = "MMM yyyy"

    }

    static class DateTimeFormat {

        static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"

    }

    static class Message {

        static final String SEARCHING_ORDER = "Searching order..."
        static final String FINISHED_SEARCHING_ORDER = "Finished searching order!"
        static final String SEARCHING_INSPECTION = "Searching inspection"
        static final String FINISHED_SEARCHING_INSPECTION = "Finished searching inspection!"
        static final String SAVING_INSPECTION = "Saving inspection"
        static final String EXISTENT_INSPECTION = "Existent inspection"
        static final String ERROR_SAVING_INSPECTION = "Error saving inspection"
        static final String SAVED_INSPECTION = "Saved inspection!"

    }

    static class Item {

        static final String FPITV = "FPITV"

    }

}
