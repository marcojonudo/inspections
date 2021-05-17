package inspections.domains.fviberi


import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class OrderLine implements GormEntity<OrderLine> {

    int orderNumber
	int article

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvlinord'

		orderNumber column: 'nuordrep'
		article column: 'coarticu'

		id generator: 'assigned', name: 'orderNumber'
		version false
	}

}
