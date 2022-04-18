package inspections.utils

import groovy.transform.CompileStatic
import inspections.domains.items.Item

import java.time.LocalDate
import java.time.format.DateTimeFormatter

@CompileStatic
class Utils {

	static String formatItvDate(LocalDate day) {
		return day.format(DateTimeFormatter.ofPattern(Constants.DateFormat.yyyy_MM))
	}

	static String parseExpiredItv(LocalDate day) {
		return day.isAfter(LocalDate.now()) ? "N" : "S"
	}

	static Item findItem(List<Item> items, String itemCode) {
		return items.find { it.code == itemCode }
	}

}
