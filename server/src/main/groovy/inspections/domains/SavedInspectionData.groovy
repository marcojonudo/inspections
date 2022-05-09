package inspections.domains

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
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

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime saved = LocalDateTime.now()

	static belongsTo = SavedInspection

}
