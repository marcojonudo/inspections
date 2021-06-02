package inspections.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"

    static class DataSource {

        static final String FVIBERI = "fviberi"
        static final String SCHEDULES = "schedules"

    }

    static class DateTimeFormat {

        static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"

    }

}
