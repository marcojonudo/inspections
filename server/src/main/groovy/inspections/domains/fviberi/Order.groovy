package inspections.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.pogos.vehicles.Vehicle
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Order implements GormEntity<Order> {

	int number
	String state
	String carIdentifier
	Client client
	String sellerCode
	String vehicleType

	Vehicle vehicle

	static hasMany = [lines: OrderLine]

	static transients = ['vehicle']

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		state column: 'clsituac'
		carIdentifier column: 'numatric'
		client column: 'coclient', fetch: 'join'
		sellerCode column: 'covended'
		vehicleType column: 'tipvehicu'
		lines fetch: 'join'

		id generator: 'assigned', name: 'number'
		version false
	}

	static constraints = {
		vehicle nullable: true
	}

	enum VehicleType {

		BICICLETA("E-BIKE"),
		COCHE("CAR"),
		MOTO("MOTORBIKE"),
		PATINETE("E-SCOOTER")

		final String type

		VehicleType(String type) {
			this.type = type
		}

	}

}
