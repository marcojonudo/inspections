package inspections.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"
    static final List<String> TYRE_AGE_CODES = [Item.FNDI, Item.FNDD, Item.FNTI, Item.FNTD]

    static class DataSource {

        static final String FVIBERI = "fviberi"
        static final String SCHEDULES = "schedules"
        static final String HESTIA_INSPECTION = "hestia-inspection"

    }

    static class DateFormat {

        static final String yyyy_MM = "yyyy-MM"

    }

    static class DateTimeFormat {

        static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"

    }

    static class Message {

        static final String SEARCHING_ORDER = "Searching order..."
        static final String FINISHED_SEARCHING_ORDER = "Finished searching order!"
        static final String SEARCHING_INSPECTION = "Searching inspection"
        static final String FINISHED_SEARCHING_INSPECTION = "Finished searching inspection!"
        static final String SEARCHING_SAVED_INSPECTION = "Searching saved inspection"
        static final String EXISTENT_SAVED_INSPECTION = "Existent saved inspection"
        static final String UPDATED_ORDER = "Updated order!"
        static final String FINISHED_SEARCHING_SAVED_INSPECTION = "Finished searching saved inspection!"
        static final String SAVING_INSPECTION = "Saving inspection"
        static final String EXISTENT_INSPECTION = "Existent inspection"
        static final String ERROR_SAVING_INSPECTION = "Error saving inspection"
        static final String SAVED_INSPECTION = "Saved inspection!"
        static final String SLACK_WRONG_REQUEST = "Error sending Slack notification"
        static final String WRONG_FPITV_FIELD = "Wrong FPITV item field"

    }

    static class Item {

        static final String FPITV = "FPITV"
        static final String FNDI = "FNDI"
        static final String FNDD = "FNDD"
        static final String FNTI = "FNTI"
        static final String FNTD = "FNTD"

    }

}
