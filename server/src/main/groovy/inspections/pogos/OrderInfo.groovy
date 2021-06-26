package inspections.pogos

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.domains.fviberi.Centre
import inspections.domains.fviberi.Order

@TupleConstructor
@CompileStatic
class OrderInfo {

	Order order
	Centre centre

}
