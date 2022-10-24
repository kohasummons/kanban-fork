import { v4 as uuidv4 } from 'uuid'
import { useTicketModal } from './core/modals'
import { dummyData, keys } from '@/helper/data'
import { levelType } from '@/helper/type'

const taskModalState = {
	type: ref(''),
	id: ref(''),
	modal_title: ref(''),
	title: ref(''),
	desc: ref(''),
	level: ref<levelType>(),
	assignee: ref('')
}

const clearTaskModalState = () => {
	taskModalState.type.value = ''
	taskModalState.modal_title.value = ''
	taskModalState.title.value = ''
	taskModalState.desc.value = ''
	taskModalState.level.value = null
	taskModalState.assignee.value = ''
}

export const useTicket = () => {
	const loading = ref(false)
	const createTicket = () => {
		loading.value = true
		//
		dummyData.value[taskModalState.type.value].push({
			id: uuidv4(),
			title: taskModalState.title.value,
			desc: taskModalState.desc.value,
			level: Number(taskModalState.level.value),
			assignee: taskModalState.assignee.value
		})
		loading.value = false
		useTicketModal().closeCreateTicket()
		clearTaskModalState()
	}
	return { loading, createTicket, taskModalState }
}

export const useEditTicket = () => {
	const loading = ref(false)
	const openEditTicket = (data, title) => {
		loading.value = true
		taskModalState.type.value = keys[title]
		taskModalState.id.value = data.id
		taskModalState.title.value = data.title
		taskModalState.desc.value = data.desc
		taskModalState.level.value = data.level
		taskModalState.assignee.value = data.assignee
		openTicketModal(data.title, true)
		loading.value = false
	}

	const editTicket = () => {
		loading.value = true
		console.log(taskModalState.type.value)
		console.log(dummyData.value[taskModalState.type.value])
		const index = dummyData.value[taskModalState.type.value].findIndex((item) => item.id === taskModalState.id.value)
		dummyData.value[taskModalState.type.value][index].title = taskModalState.title.value
		dummyData.value[taskModalState.type.value][index].desc = taskModalState.desc.value
		dummyData.value[taskModalState.type.value][index].level = Number(taskModalState.level.value)
		dummyData.value[taskModalState.type.value][index].assignee = taskModalState.assignee.value
		loading.value = false
		useTicketModal().closeEditTicket()
		clearTaskModalState()
	}
	return { loading, openEditTicket, taskModalState, editTicket }
}

export const openTicketModal = (ticketType, edit = false) => {
	if (edit) {
		taskModalState.modal_title.value = `Edit "${ticketType}" Ticket`
		useTicketModal().openEditTicket()
	} else {
		clearTaskModalState()
		taskModalState.type.value = keys[ticketType]
		taskModalState.modal_title.value = `Create "${ticketType}" Ticket`
		useTicketModal().openCreateTicket()
	}
}

export const useDeleteTicket = () => {
	const loading = ref(false)
	const deleteTicket = (data, title) => {
		loading.value = true
		const index = dummyData.value[keys[title]].findIndex((item) => item.id === data.id)
		dummyData.value[keys[title]].splice(index, 1)
		loading.value = false
	}
	return { loading, deleteTicket }
}