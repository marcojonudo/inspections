package inspections.domains.fviberi


import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class OrderTime implements GormEntity<OrderTime> {

	Integer orderNumber
	String shortCode

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvsegtie'

		orderNumber column: 'nuordrep'
		shortCode column: 'codcorto'

		id generator: 'assigned', name: 'orderNumber'
		version false
	}

}
