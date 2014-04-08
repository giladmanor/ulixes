class Sparse
  
  def initialize(dimentions)
    @dimentions = dimentions.sort
    @points = []
  end
  
  def <<(point)
    @points<< @dimentions.map{|d| point[d] || 0}
  end
  
  def vote(paragons)
    paragon_pull = paragons.map
    
    @points.each{|p| 
      #Calculate pull factors for each paragon 
      pull_factors = paragons.map{|pr| distance(p,pr)/paragons.length}
      mover = paragons[pull_factors.index(pull_factors.max)]
      paragon_pull[paragons.index(mover)] = sub(paragon_pull[paragons.index(mover)],p,pull_factors.max)
      
    }
    paragon_pull
  end
  
  def sub(point,influencer,factor)#returns a new point/vector
    #point = point || Array.new(influencer.length, 0)
    point.map.with_index{|c,i| c-(influencer[i]*factor)}
  end
  
  def distance(p1,p2)#return scalar
    res = 0
    p1.each.with_index{|c,i| res += c*p2[i]}
    res
  end
  
  def to_s
    @dimentions.map{|k,va| "#{k}=>#{va}"}.join("\n")
  end
  
end
