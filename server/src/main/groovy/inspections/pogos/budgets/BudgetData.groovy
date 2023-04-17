package inspections.pogos.budgets

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@CompileStatic
@TupleConstructor
class BudgetData {

	TyreMeasurementData tyreData
	float units

}
