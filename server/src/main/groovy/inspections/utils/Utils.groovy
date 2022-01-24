package inspections.utils

import groovy.transform.CompileStatic

import java.time.LocalDate
import java.time.format.DateTimeFormatter

@CompileStatic
class Utils {

	static String formatItvDate(LocalDate day) {
		return day.format(DateTimeFormatter.ofPattern(Constants.DateFormat.MMM_yyyy)).toUpperCase()
	}

	static String parseExpiredItv(LocalDate day) {
		return day.isAfter(LocalDate.now()) ? "N" : "S"
	}

}
