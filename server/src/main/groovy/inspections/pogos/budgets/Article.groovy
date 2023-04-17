package inspections.pogos.budgets


import groovy.transform.CompileStatic

@CompileStatic
class Article {

	Integer code
	String name
	Float units

	Article clone(float units) {
		return new Article(code: code, name: name, units: units)
	}

}
