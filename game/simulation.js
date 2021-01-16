const simulation = (t, state) => {
    if (!state) return;

    console.log(state.entities);
    for (const entity of state.entities.values()) {
        // TODO Scale this using some dt
        entity.position.x += (entity.moving || 0) * 10;
    }
};

export default simulation;
