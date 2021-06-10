package inspections.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Order implements GormEntity<Order> {

	int number
	Vehicle vehicle

	static hasMany = [lines: OrderLine]

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		vehicle column: 'numatric', fetch: 'join'
		lines fetch: 'join'

		id generator: 'assigned', name: 'number'
		version false
	}

}
