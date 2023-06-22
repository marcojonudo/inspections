import { SavedItem } from './saved-items/saved-item';
import { Action } from './relations/actions/action';
import { ActionType } from './relations/actions/action-type';
import { RelationTrigger } from './relations/triggers/relation-trigger';
import { TriggerType } from './relations/triggers/trigger-type';

export class ItemRelation {

	triggerType: string;
	triggerItemCode: string;
	matchText: string;
	differentMatchText: boolean;
	targetItemCode: string;
	actionType: string;
	targetText: string;
	trigger: RelationTrigger;
	action: Action;

	constructor(itemRelation: any) {
		this.triggerType = itemRelation.triggerType;
		this.matchText = itemRelation.matchText;
		this.differentMatchText = itemRelation.differentMatchText;
		this.triggerItemCode = itemRelation.triggerItemCode;
		this.targetItemCode = itemRelation.targetItemCode;
		this.actionType = itemRelation.actionType;
		this.targetText = itemRelation.targetText;
		this.trigger = TriggerType.parse(this.triggerType).buildRelationTrigger(this.matchText, this.differentMatchText);
		this.action = ActionType.parse(this.actionType).buildAction();
	}

	match(newValue: string): boolean {
		return this.trigger.match(newValue);
	}

	apply(targetSavedItem: SavedItem, employeeCode: string): void {
		this.action.apply(targetSavedItem, this.targetText, employeeCode);
	}

}
