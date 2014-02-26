class VisualAidController < AdminController
  def index

  end

  def show
    render params[:id]
  end

  def get_node_trace
    node = @account.nodes.find(params[:id])
    render :json=>{:name=>node.name,:size=>node.users.size,:actions=>node.user_events.map{|k,v| {:name=>k,:value=>v}}}
  end

  def get_node_dependancy
    node_names = @account.nodes.map{|n| n.name}
    node_ids = @account.nodes.map{|n| n.id}

    transitions = @account.users.map{|u| u.flags.where(:code=>"_TRANSITION").map{|e| e.value.to_i}}.flatten

    dependencies =node_ids.map{|nid| node_ids.map{|nidd| 0}}
    transitions.map{|eid|
      edge = @account.edges.find(eid)
      dependencies[node_ids.index(edge.target_id)][node_ids.index(edge.source_id)] +=1
    }
    logger.debug dependencies.inspect

    render :json=>{:nodes=>node_names, :dependencies=>dependencies}
  end

end
