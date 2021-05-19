package inspections.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Order implements GormEntity<Order> {

	int number

	static hasMany = [lines: OrderLine]

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		lines fetch: 'join'

		id generator: 'assigned', name: 'number'
		version false
	}

}
