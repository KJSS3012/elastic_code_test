import producerReducer, {
  addProducer,
  removeProducer,
  updateProducer,
  type Producer,
  type ProducerState
} from '../../stores/producer/slice';

const initialState: ProducerState = {
  producers: [],
  loading: false
};

const mockProducer: Producer = {
  id: '1',
  document: '123.456.789-01',
  document_type: 'CPF',
  producer_name: 'João Silva',
  farms: []
};

describe('Producer Slice', () => {
  test('should add producer', () => {
    const state = producerReducer(initialState, addProducer(mockProducer));
    expect(state.producers).toHaveLength(1);
    expect(state.producers[0]).toEqual(mockProducer);
  });

  test('should remove producer', () => {
    const stateWithProducer = {
      ...initialState,
      producers: [mockProducer]
    };

    const state = producerReducer(stateWithProducer, removeProducer('1'));
    expect(state.producers).toHaveLength(0);
  });

  test('should update producer', () => {
    const stateWithProducer = {
      ...initialState,
      producers: [mockProducer]
    };

    const updatedProducer = {
      ...mockProducer,
      producer_name: 'João Santos'
    };

    const state = producerReducer(stateWithProducer, updateProducer(updatedProducer));
    expect(state.producers[0].producer_name).toBe('João Santos');
  });
});
