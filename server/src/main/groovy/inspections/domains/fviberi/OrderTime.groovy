package inspections.domains.fviberi


import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDate

@Entity
class OrderTime implements GormEntity<OrderTime> {

	Integer orderNumber
	String shortCode
	LocalDate day

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvsegtie'

		orderNumber column: 'nuordrep'
		shortCode column: 'codcorto'
		day column: 'feordrep'

		id generator: 'assigned', name: 'orderNumber'
		version false
	}

}
