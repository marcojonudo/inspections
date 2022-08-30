package inspections.pogos.budgets

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.deserializers.CustomLocalDateTimeDeserializer
import inspections.utils.Constants

import java.time.LocalDateTime

@CompileStatic
@TupleConstructor
class Budget {

	int number

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonDeserialize(using = CustomLocalDateTimeDeserializer)
	LocalDateTime date

	List<BudgetLine> lines

}
