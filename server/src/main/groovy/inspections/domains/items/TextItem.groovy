package inspections.domains.items


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItem extends Item implements GormEntity<TextItem> {

	static hasMany = [sections: TextItemSection]

	static mapping = {
		sections fetch: 'join'
	}

}
