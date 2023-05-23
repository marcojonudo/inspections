package inspections.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"
    static final float KW_TO_CV_FACTOR = 1.35962
    static final List<String> TYRE_AGE_CODES = [Item.FNDI, Item.FNDD, Item.FNTI, Item.FNTD]
    static final List<String> TYRE_STATE_CODES = [Item.ENDI, Item.ENDD, Item.ENTI, Item.ENTD]
    static final List<String> FRONT_TYRE_CODES = [Item.ENDI, Item.ENDD]
    static final List<String> BACK_TYRE_CODES = [Item.ENTI, Item.ENTD]
    static final List<String> WRONG_ITEM_OPTIONS = ["SN", "PS"]
    static final String PENDING_SELECT_OPTION = "P"
    static final String CORRECT_SELECT_OPTION = "C"

    static class DataSource {

        static final String FVIBERI = "fviberi"
        static final String SCHEDULES = "schedules"

    }

    static class DateFormat {

        static final String yyyy_MM = "yyyy-MM"

    }

    static class DateTimeFormat {

        static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"
        static final String yyyy_MM_dd_T_hh_MM_ss_Z = "yyyy-MM-dd'T'HH:mm:ss'Z'"

    }

    static class Message {

        static final String SEARCHING_ORDER = "Searching order..."
        static final String FINISHED_SEARCHING_ORDER = "Finished searching order!"
        static final String SEARCHING_INSPECTION = "Searching inspection"
        static final String FINISHED_SEARCHING_INSPECTION = "Finished searching inspection!"
        static final String SEARCHING_SAVED_INSPECTION = "Searching saved inspection"
        static final String EXISTENT_SAVED_INSPECTION = "Existent saved inspection"
        static final String EXISTENT_INSPECTION_SAVED = "Existent inspection saved values"
        static final String NEW_DATA_SAVED = "New inspection data saved value"
        static final String UPDATED_ORDER = "Updated order!"
        static final String FINISHED_SEARCHING_SAVED_INSPECTION = "Finished searching saved inspection!"
        static final String SAVING_INSPECTION = "Saving inspection"
        static final String SAVE_INSPECTION_DURATION = "Save inspection duration"
        static final String ERROR_SAVING_INSPECTION = "Error saving inspection"
        static final String SAVED_INSPECTION = "Saved inspection!"
        static final String SLACK_WRONG_REQUEST = "Error sending Slack notification"
        static final String WRONG_FPITV_FIELD = "Wrong FPITV item field"
        static final String CORRECT_TYRE_ITEMS = "Not generated budget, as all tyre items are correct"
        static final String INCOMPLETE_FIELDS = "Not generated budget, as tyre measurement values are incomplete"
        static final String WRONG_ORDERS_MANAGEMENT_REQUEST = "Error requesting tyre budget articles codes"
        static final String TYRE_BUDGET_ARTICLE_CODES = "Tyre budget articles codes"
        static final String ERROR_REQUESTING_BUDGET = "Error requesting budget"
        static final String ALREADY_EXISTENT_BUDGET = "Already existent budget checked"
        static final String WRONG_CREATE_BUDGET_REQUEST = "Error requesting budget creation"
        static final String CREATED_BUDGET = "Created budget!"
        static final String CALC_POWER_ERROR = "Error calculating vehicle power"

    }

    static class Item {

        static final String FPITV = "FPITV"
        static final String FNDI = "FNDI"
        static final String FNDD = "FNDD"
        static final String FNTI = "FNTI"
        static final String FNTD = "FNTD"
        static final String ENDI = "ENDI"
        static final String ENDD = "ENDD"
        static final String ENTI = "ENTI"
        static final String ENTD = "ENTD"
        static final String PN = "PN"

    }

}
