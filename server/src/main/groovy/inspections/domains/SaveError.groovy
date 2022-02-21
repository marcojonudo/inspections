package inspections.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
class SaveError implements GormEntity<SaveError> {

	int orderNumber
	String employeeCode
	String numberPlate
	String savedInspection
	int statusCode
	String error
	LocalDateTime created = LocalDateTime.now()

}
