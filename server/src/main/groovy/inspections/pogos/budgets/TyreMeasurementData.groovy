package inspections.pogos.budgets

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@CompileStatic
@TupleConstructor
class TyreMeasurementData {

	String measurement
	String serialNumber
	String tyre
	String load
	String speed

}
