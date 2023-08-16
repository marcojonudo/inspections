package inspections.domains.fviberi.vehicle

import grails.gorm.annotation.Entity
import inspections.pogos.vehicles.CarVehicle
import inspections.pogos.vehicles.MotorbikeVehicle
import inspections.pogos.vehicles.Vehicle
import inspections.pogos.vehicles.VehicleType
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Car implements GormEntity<Car>, IVehicle {

    String vehicleType
    String numberPlate
    String model
    String cylinder
    String brand
    Integer registrationYear
    String itvDate
    String expiredItv
    String engineCode
    String power

    static transients = ['type', 'engineCode', 'power']

    static constraints = {
        registrationYear nullable: true
    }

    static mapping = {
        datasource Constants.DataSource.FVIBERI
        table 'fvvehicu'

        vehicleType column: 'tipovehicu'
        numberPlate column: 'numatric'
        model column: 'nomodelo'
        cylinder column: 'nucilind'
        brand column: 'nomarcav'
        registrationYear column: 'nuanomat'
        itvDate column: 'fechaitv'
        expiredItv column: 'itvcaducada'

        id name: 'numberPlate', generator: 'assigned'
        version false
    }

    Vehicle buildVehicle() {
        VehicleType type = VehicleType.values().find { it.type == vehicleType }
        return type == VehicleType.CAR ? new CarVehicle(this) : new MotorbikeVehicle(this)
    }

}
