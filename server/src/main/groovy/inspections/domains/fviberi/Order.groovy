package inspections.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import inspections.pogos.vehicles.Vehicle
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDate

@Entity
class Order implements GormEntity<Order> {

	int number
	String code

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
	String state
	String carIdentifier
	Client client
	String sellerCode
	String vehicleType

	Vehicle vehicle

	static hasMany = [lines: OrderLine]

	static transients = ['code', 'vehicle']

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		day column: 'feordrep'
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

		BICICLETA("E_BIKE"),
		COCHE("CAR"),
		MOTO("MOTORBIKE"),
		PATINETE("E_SCOOTER")

		final String type

		VehicleType(String type) {
			this.type = type
		}

	}

}
