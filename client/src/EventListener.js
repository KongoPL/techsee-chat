export default class EventListener
{
	constructor()
	{
		this.listeners = [];
	}


	subscribe(callback)
	{
		return this.listeners.push(callback);
	}


	emit()
	{
		for(const callback of this.listeners)
			callback(...arguments);
	}


	unsubscribe(callback)
	{
		const index = this.listeners.indexOf(callback);

		if(index === -1)
			return false;

		this.listeners.splice(index, 1);

		return true;
	}
}
