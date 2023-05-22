import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;

	memoizedProps: Props | null;

	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// * instance type
		// * e.g. for a FunctionComponent
		// * the tag value is 0;
		// * the type is the function itself () => {}
		this.tag = tag;
		this.type = null;

		this.key = key;

		// * save the HostComponent's DOM
		this.stateNode = null;

		//! properties to link between fiber nodes
		//! they make a tree
		// * return -> parent fiber node
		// * sibling -> next same level fiber node
		// * child -> child fiber node
		this.return = null;
		this.sibling = null;
		this.child = null;

		// * the index of parallel fiber nodes
		// * e.g. ui > li * 3
		// * li elements have index of 0, 1, 3 respectively
		this.index = 0;

		this.ref = null;

		//! work unit data
		//* pendingProps/memoizedProps store the props data from the ReactElement
		//* pendingProps stores the data before work
		//* memoizedProps stores the data after work
		this.pendingProps = pendingProps;
		this.memoizedProps = null;

		// * react stores two fiber node tree: current & workInProgress
		// * current represent the current DOM
		// * workInProgress is the new tree about to update
		// * alternate is use to point to the other corresponding fiber node
		// * e.g. if this fiber node is current tree, the alternate points to same one in workInProgress tree vice versa
		this.alternate = null;

		// * after fiber node being worked. It is flagged as different value
		// * like Placement, Update, then the ReactDOM uses flag to call DOM api
		// * e.g. appendChild, removeChild
		this.flags = NoFlags;
	}
}
