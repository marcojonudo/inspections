package inspections.domains

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@TupleConstructor(excludes = 'savedInspection')
class SavedInspectionData implements GormEntity<SavedInspectionData> {

	@JsonIgnore
	SavedInspection savedInspection

	String employeeCode

	Reason reason = Reason.SAVED

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonSerialize(using = LocalDateTimeSerializer)
	LocalDateTime saved = LocalDateTime.now()

	static belongsTo = SavedInspection

	enum Reason {

		SAVED,
		UPDATED,
		UPDATED_ORDER,
		SENT

	}

}
